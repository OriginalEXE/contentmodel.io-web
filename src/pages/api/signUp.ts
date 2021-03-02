import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '@/src/features/auth/auth0';

export default async function signUp(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    await auth0.handleLogin(req, res, {
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
