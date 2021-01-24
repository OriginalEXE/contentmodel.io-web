import * as z from 'zod';

import { contentfulSpacesSchema } from '@/src/features/content-model/types/contentfulSpace';

interface GetContentfulSpacesInput {
  token: string;
}
type GetContentfulSpacesResult = z.infer<typeof contentfulSpacesSchema>;

const getContentfulSpaces = async (
  input: GetContentfulSpacesInput,
): Promise<GetContentfulSpacesResult> => {
  return fetch(
    `https://api.contentful.com/spaces?access_token=${input.token}&limit=100`,
  ).then((res) => res.json());
};

export default getContentfulSpaces;
