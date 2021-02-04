import * as z from 'zod';

import { contentfulEnvironmentsSchema } from '@/src/features/content-model/types/contentfulEnvironment';
import { contentfulRequestError } from '@/src/features/content-model/types/contentfulRequestError';

interface GetContentfulEnvironmentsInput {
  token: string;
  spaceId: string;
}
type GetContentfulEnvironmentsResult =
  | z.infer<typeof contentfulEnvironmentsSchema>
  | z.infer<typeof contentfulRequestError>;

const getContentfulEnvironments = async (
  input: GetContentfulEnvironmentsInput,
): Promise<GetContentfulEnvironmentsResult> => {
  return fetch(
    `https://api.contentful.com/spaces/${input.spaceId}/environments?access_token=${input.token}&limit=100`,
  ).then((res) => res.json());
};

export default getContentfulEnvironments;
