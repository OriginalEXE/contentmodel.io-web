import catchify from 'catchify';
import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '@/src/features/auth/auth0';
import { getAccessToken } from '@/src/features/auth/server';
import createUser from '@/src/features/user/api/createUser';
import {
  setCookies,
  parseCookies,
} from '@auth0/nextjs-auth0/dist/utils/cookies';
import { decodeState } from '@auth0/nextjs-auth0/dist/utils/state';

export default async function afterAuth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  // Custom logout implementation due to not being able to customize redirect url
  // when logging out with auth0.handleLogout(req, res);
  const logoutAndRedirectToFail = (): void => {
    setCookies(req, res, [
      {
        name: 'a0:state',
        value: '',
        maxAge: -1,
      },
      {
        name: 'a0:session',
        value: '',
        maxAge: -1,
        path: '/',
      },
    ]);

    // Was not able to create a user in the db
    res.writeHead(302, {
      Location: '/?error=failed-to-login',
    });
    res.end();
  };

  const session = await auth0.getSession(req);

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

  console.log(`Fetching from GraphQL with the following token: ${accessToken}`);

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
    logoutAndRedirectToFail();
    return;
  }

  const cookies = parseCookies(req);
  const auth0state = cookies['a0:state'];
  const parsedState = decodeState(auth0state);

  if (createdUser.createUser.fresh === true) {
    // This is a new user
    res.writeHead(302, {
      Location: parsedState.redirectTo
        ? `${parsedState.redirectTo}?new-user=1`
        : '/?new-user=1',
    });
    res.end();
    return;
  }

  // An old user signing in
  res.writeHead(302, {
    Location: parsedState.redirectTo
      ? `${parsedState.redirectTo}?new-user=0`
      : '/?new-user=0',
  });
  res.end();
}
