import * as z from 'zod';

import { contentfulRequestError } from '@/src/features/content-model/types/contentfulRequestError';
import { contentfulSpacesSchema } from '@/src/features/content-model/types/contentfulSpace';

interface GetContentfulSpacesInput {
  token: string;
}
type GetContentfulSpacesResult =
  | z.infer<typeof contentfulSpacesSchema>
  | z.infer<typeof contentfulRequestError>;

const getContentfulSpaces = async (
  input: GetContentfulSpacesInput,
): Promise<GetContentfulSpacesResult> => {
  const pageSize = 100;

  let items: z.infer<typeof contentfulSpacesSchema>['items'] = [];
  let total = 0;
  let error: z.infer<typeof contentfulRequestError> | undefined;

  const fetchSpaces = async (skip = 0): Promise<void> => {
    const spaces = await fetch(
      `https://api.contentful.com/spaces?access_token=${
        input.token
      }&limit=${pageSize}&skip=${skip * pageSize}`,
    ).then((res) => res.json());

    if (spaces.items === undefined) {
      error = spaces;
      return;
    }

    items = [...items, ...spaces.items];

    total = spaces.total;

    if (total > pageSize * (skip + 1)) {
      return fetchSpaces(skip + pageSize);
    }
  };

  if (error !== undefined) {
    return error;
  }

  await fetchSpaces();

  return {
    items,
    total,
  };
};

export default getContentfulSpaces;
