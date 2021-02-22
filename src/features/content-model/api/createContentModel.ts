import { gql } from 'graphql-request';

import {
  CreateContentModelInput,
  ContentModel,
} from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type CreateContentModelResult = {
  createContentModel: Pick<ContentModel, 'slug'>;
};

const createContentModel = async (
  input: CreateContentModelInput,
  cookie?: string,
  authorization?: string,
): Promise<CreateContentModelResult> => {
  const client = getClient(cookie, authorization);
  const mutation = gql`
    mutation CreateContentModel(
      $title: String!
      $description: String!
      $version: CreateContentModelVersionInput!
      $visibility: String!
    ) {
      createContentModel(
        createContentModel: {
          title: $title
          description: $description
          version: $version
          visibility: $visibility
        }
      ) {
        slug
      }
    }
  `;

  return client.request<CreateContentModelResult, CreateContentModelInput>(
    mutation,
    input,
  );
};

export default createContentModel;
