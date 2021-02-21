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
  try {
    const { accessToken } = await auth0.getAccessToken(req, res);

    return accessToken || null;
  } catch {
    return null;
  }
};
