import { gql } from 'graphql-request';

import { DbContentModel } from '@/src/features/content-model/types/dbContentModel';
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
    query($slug: String!, $secret: String) {
      contentModelBySlug(slug: $slug, secret: $secret) {
        id
        createdAt
        updatedAt
        cms
        slug
        title
        description
        visibility
        user {
          id
          name
          picture
        }
        model
        position
        stars
        starred
        ogMetaImage {
          src
          path
          width
          height
        }
        image {
          src
          path
          width
          height
        }
        imageNoConnections {
          src
          path
          width
          height
        }
      }
    }
  `;

  return client.request<GetContentModelBySlugResult>(query, input);
};

export default getContentModelBySlug;
