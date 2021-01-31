import * as z from 'zod';

import { contentfulOrganizationsSchema } from '@/src/features/content-model/types/contentfulOrganization';
import { contentfulRequestError } from '@/src/features/content-model/types/contentfulRequestError';

interface GetContentfulOrganizationsInput {
  token: string;
}
type GetContentfulOrganizationsResult =
  | z.infer<typeof contentfulOrganizationsSchema>
  | z.infer<typeof contentfulRequestError>;

const getContentfulOrganizations = async (
  input: GetContentfulOrganizationsInput,
): Promise<GetContentfulOrganizationsResult> => {
  return fetch(
    `https://api.contentful.com/organizations?access_token=${input.token}&limit=100`,
  ).then((res) => res.json());
};

export default getContentfulOrganizations;
