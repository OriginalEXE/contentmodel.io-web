import { gql } from 'graphql-request';

import { DbContentModel } from '@/src/content-model/types/dbContentModel';
import { QueryContentModelBySlugArgs } from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type GetContentModelBySlugResult = {
  contentModelBySlug: DbContentModel | null;
};

const getContentModelBySlug = async (
  input: QueryContentModelBySlugArgs,
  cookie?: string,
  authorization?: string,
): Promise<GetContentModelBySlugResult> => {
  const client = getClient(cookie, authorization);
  const query = gql`
    query($slug: String!) {
      contentModelBySlug(slug: $slug) {
        id
        createdAt
        updatedAt
        cms
        slug
        title
        description
        user {
          id
          name
          picture
        }
        model
        position
      }
    }
  `;

  return client.request<GetContentModelBySlugResult>(query, input);
};

export default getContentModelBySlug;
