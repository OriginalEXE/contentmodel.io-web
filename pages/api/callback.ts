import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '@/src/auth/auth0';

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    await auth0.handleCallback(req, res, { redirectTo: '/api/afterAuth' });
  } catch (error) {
    console.error(error);
    res.writeHead(302, {
      Location: '/?error=failed-to-login',
    });
    res.end();
  }
}
