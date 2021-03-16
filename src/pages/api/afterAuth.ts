import catchify from 'catchify';
import { NextApiRequest, NextApiResponse } from 'next';
import queryString from 'query-string';
import isEmail from 'validator/lib/isEmail';

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

  const redirectTo =
    typeof req.query.redirectTo === 'string'
      ? req.query.redirectTo || '/'
      : '/';

  if (createdUser.createUser.fresh === true) {
    // This is a new user

    // Here we check if user has an email set as their name (happens when
    // non-social auth is used), and if so redirect them to the profile
    // settings page
    if (isEmail(createdUser.createUser.user.name) === true) {
      res.writeHead(302, {
        Location: `/profile?${queryString.stringify({
          redirectTo: redirectTo,
          'new-user': '1',
        })}`,
      });
    } else {
      const parsed = queryString.parseUrl(redirectTo as string);
      res.writeHead(302, {
        Location: `${parsed.url}?${queryString.stringify({
          ...parsed.query,
          'new-user': '1',
        })}`,
      });
    }

    res.end();
    return;
  }

  // An old user signing in
  const parsed = queryString.parseUrl(redirectTo as string);
  res.writeHead(302, {
    Location: `${parsed.url}?${queryString.stringify({
      ...parsed.query,
      'new-user': '0',
    })}`,
  });
  res.end();
  return;
}
