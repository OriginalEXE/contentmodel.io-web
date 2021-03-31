import { gql } from 'graphql-request';

import {
  UnstarContentModelInput,
  ContentModel,
} from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type UnstarContentModelResult = {
  unstarContentModel: Pick<ContentModel, 'slug'>;
};

const unstarContentModel = async (
  input: UnstarContentModelInput,
  cookie?: string,
  authorization?: string,
): Promise<UnstarContentModelResult> => {
  const client = getClient(cookie, authorization);
  const mutation = gql`
    mutation UnstarContentModel($id: String!) {
      unstarContentModel(unstarContentModel: { id: $id }) {
        slug
      }
    }
  `;

  return client.request<UnstarContentModelResult, UnstarContentModelInput>(
    mutation,
    input,
  );
};

export default unstarContentModel;
