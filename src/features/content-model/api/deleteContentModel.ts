import { gql } from 'graphql-request';

import {
  DeleteContentModelInput,
  ContentModel,
} from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type DeleteContentModelResult = {
  deleteContentModel: Pick<ContentModel, 'slug'>;
};

const deleteContentModel = async (
  input: DeleteContentModelInput,
  cookie?: string,
  authorization?: string,
): Promise<DeleteContentModelResult> => {
  const client = getClient(cookie, authorization);
  const mutation = gql`
    mutation CreateContentModel($id: String!) {
      deleteContentModel(deleteContentModel: { id: $id }) {
        slug
      }
    }
  `;

  return client.request<DeleteContentModelResult, DeleteContentModelInput>(
    mutation,
    input,
  );
};

export default deleteContentModel;
