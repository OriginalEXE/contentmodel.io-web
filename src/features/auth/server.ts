import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '@/src/features/auth/auth0';

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
