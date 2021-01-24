import catchify from 'catchify';
import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '@/src/features/auth/auth0';

interface AccessTokenResponseInterface {
  accessToken?: string | undefined;
}

export const getAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> => {
  const tokenCache = auth0.tokenCache(req, res);

  const [accessTokenCacheError, accessTokenCache]: [
    Error,
    AccessTokenResponseInterface,
  ] = await catchify(tokenCache.getAccessToken());

  if (accessTokenCacheError !== null) {
    return null;
  }

  if (accessTokenCache.accessToken === undefined) {
    return null;
  }

  return accessTokenCache.accessToken;
};
