import { gql } from 'graphql-request';

import { DbContentModel } from '@/src/features/content-model/types/dbContentModel';
import { QueryContentModelsArgs } from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type GetContentModelsResult = {
  contentModels: {
    items: DbContentModel[];
  };
};

const getContentModels = async (
  input: QueryContentModelsArgs,
  cookie?: string,
  authorization?: string,
): Promise<GetContentModelsResult> => {
  const client = getClient(cookie, authorization);
  const query = gql`
    query($count: Int, $user: String) {
      contentModels(count: $count, user: $user) {
        items {
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
    }
  `;

  return client.request<GetContentModelsResult>(query, input);
};

export default getContentModels;
