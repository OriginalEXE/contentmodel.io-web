import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '@/src/auth/auth0';

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const tokenCache = await auth0.tokenCache(req, res);

  res.json({
    authToken: await tokenCache.getAccessToken(),
  });
}
