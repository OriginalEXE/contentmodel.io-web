import catchify from 'catchify';
import { NextApiRequest, NextApiResponse } from 'next';
import queryString from 'query-string';

import auth0 from '@/src/features/auth/auth0';
import { getAccessToken } from '@/src/features/auth/server';
import createUser from '@/src/features/user/api/createUser';

export default async function afterAuth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const session = await auth0.getSession(req, res);

  if (session === null || session === undefined) {
    res.writeHead(302, {
      Location: '/',
    });
    res.end();
    return;
  }

  const { user } = session;
  const {
    email,
    name = '',
    picture = '',
  }: { email?: string; name?: string; picture?: string } = user;

  if (email === undefined) {
    res.writeHead(302, {
      Location: '/?error=email-not-present',
    });
    res.end();
    return;
  }

  const accessToken = await getAccessToken(req, res);

  if (accessToken === null || accessToken === '') {
    console.error('Access token not present');
    res.writeHead(302, {
      Location: '/?error=failed-to-login',
    });
    res.end();
    return;
  }

  const [createUserError, createdUser] = await catchify(
    createUser(
      {
        email,
        name,
        picture,
      },
      undefined,
      `Bearer ${accessToken}`,
    ),
  );

  if (createUserError !== null) {
    // Was not able to create a user in the db
    console.error(createUserError);
    auth0.handleLogout(req, res, {
      returnTo: '/?error=failed-to-login',
    });
    return;
  }

  if (createdUser.createUser.fresh === true) {
    // This is a new user
    if (req.query.redirectTo) {
      const parsed = queryString.parseUrl(req.query.redirectTo as string);
      res.writeHead(302, {
        Location: `${parsed.url}?${queryString.stringify({
          ...parsed.query,
          'new-user': '1',
        })}`,
      });
      res.end();
      return;
    } else {
      res.writeHead(302, {
        Location: '/?new-user=1',
      });
      res.end();
      return;
    }
  }

  // An old user signing in
  if (req.query.redirectTo) {
    const parsed = queryString.parseUrl(req.query.redirectTo as string);
    res.writeHead(302, {
      Location: `${parsed.url}?${queryString.stringify({
        ...parsed.query,
        'new-user': '0',
      })}`,
    });
    res.end();
    return;
  } else {
    res.writeHead(302, {
      Location: '/?new-user=0',
    });
    res.end();
    return;
  }
}
