import { gql } from 'graphql-request';

import {
  UpdateContentModelInput,
  ContentModel,
} from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type UpdateContentModelResult = {
  updateContentModel: Pick<ContentModel, 'slug'>;
};

const updateContentModel = async (
  input: UpdateContentModelInput,
  cookie?: string,
  authorization?: string,
): Promise<UpdateContentModelResult> => {
  const client = getClient(cookie, authorization);
  const mutation = gql`
    mutation CreateContentModel(
      $id: String!
      $title: String
      $description: String
      $version: UpdateContentModelVersionInput
      $visibility: String
    ) {
      updateContentModel(
        updateContentModel: {
          id: $id
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

  return client.request<UpdateContentModelResult, UpdateContentModelInput>(
    mutation,
    input,
  );
};

export default updateContentModel;
