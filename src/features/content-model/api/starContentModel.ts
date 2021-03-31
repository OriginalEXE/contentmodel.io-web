import { gql } from 'graphql-request';

import { StarContentModelInput, ContentModel } from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type StarContentModelResult = {
  starContentModel: Pick<ContentModel, 'slug'>;
};

const starContentModel = async (
  input: StarContentModelInput,
  cookie?: string,
  authorization?: string,
): Promise<StarContentModelResult> => {
  const client = getClient(cookie, authorization);
  const mutation = gql`
    mutation StarContentModel($id: String!) {
      starContentModel(starContentModel: { id: $id }) {
        slug
      }
    }
  `;

  return client.request<StarContentModelResult, StarContentModelInput>(
    mutation,
    input,
  );
};

export default starContentModel;
