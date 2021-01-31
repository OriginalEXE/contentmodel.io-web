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
  return fetch(
    `https://api.contentful.com/spaces?access_token=${input.token}&limit=100`,
  ).then((res) => res.json());
};

export default getContentfulSpaces;
