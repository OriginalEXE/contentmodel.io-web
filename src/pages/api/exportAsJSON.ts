import catchify from 'catchify';
import { NextApiRequest, NextApiResponse } from 'next';

import { getAccessToken } from '@/src/features/auth/server';
import getContentModelBySlug from '@/src/features/content-model/api/getContentModelBySlug';
import contentModelSchema from '@/src/features/content-model/types/contentModel';

export default async function importToContentful(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const { slug: contentModelSlug } = req.query;

  if (!contentModelSlug) {
    res.status(400);
    res.json({
      error: 'Some parameters are missing',
    });
    return;
  }

  const accessToken = await getAccessToken(req, res);

  const [contentModelError, contentModel] = await catchify(
    getContentModelBySlug(
      {
        slug: contentModelSlug as string,
      },
      undefined,
      accessToken === null ? undefined : `Bearer ${accessToken}`,
    ),
  );

  if (contentModelError !== null) {
    res.status(502);
    res.json({
      error:
        'Something went wrong, please try again or reach out to us at hello@contentmodel.io',
    });
    return;
  }

  if (contentModel.contentModelBySlug === null) {
    res.status(404);
    res.json({
      error: 'We could not find the content model with that slug',
    });
    return;
  }

  const contentfulContentModel = contentModelSchema.parse(
    JSON.parse(contentModel.contentModelBySlug.model),
  );

  res.status(200);
  res.json({
    contentTypes: contentfulContentModel,
  });
}
