import catchify from 'catchify';
import { NextApiRequest, NextApiResponse } from 'next';

import { getAccessToken } from '@/src/features/auth/server';
import getContentModelBySlug from '@/src/features/content-model/api/getContentModelBySlug';
import contentModelSchema from '@/src/features/content-model/types/contentModel';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentfulImport = require('contentful-import');

export default async function importToContentful(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const {
    slug: contentModelSlug,
    spaceId,
    token,
    environmentId = '',
    publish = '0',
    contentTypes,
  } = req.query;

  if (!contentModelSlug || !spaceId || !token) {
    res.status(400);
    res.json({
      error: 'Some parameters are missing',
    });
    return;
  }

  const accessToken = await getAccessToken(req, res);

  if (accessToken === null || accessToken === '') {
    res.status(403);
    res.json({
      error: 'You ned to be authenticated to import a content model',
    });
    return;
  }

  const [contentModelError, contentModel] = await catchify(
    getContentModelBySlug(
      {
        slug: contentModelSlug as string,
      },
      undefined,
      `Bearer ${accessToken}`,
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

  const [contentfulImportError] = await catchify(
    contentfulImport({
      content: {
        contentTypes: contentfulContentModel
          .filter((contentType) => contentType.internal !== true)
          .filter((contentType) => {
            if (contentTypes === undefined) {
              return true;
            }

            if (typeof contentTypes === 'string') {
              return contentType.sys.id === contentTypes;
            }

            return contentTypes.includes(contentType.sys.id);
          })
          .map((contentType) => {
            if (publish === '0') {
              return contentType;
            }

            return {
              ...contentType,
              sys: {
                ...contentType.sys,
                publishedVersion: 1,
              },
            };
          }),
      },
      spaceId,
      environmentId: environmentId === '' ? 'master' : environmentId,
      managementToken: token,
      contentModelOnly: true,
    }),
  );

  if (contentfulImportError !== null) {
    console.error(
      contentfulImportError,
      (contentfulImportError as any).errors?.[0]?.error,
      (contentfulImportError as any).errors?.[0]?.error?.data.details,
    );

    res.status(502);
    res.json({
      error:
        'Something went wrong, please try again or reach out to us at hello@contentmodel.io',
    });
    return;
  }

  res.status(201);
  res.json({});
}
