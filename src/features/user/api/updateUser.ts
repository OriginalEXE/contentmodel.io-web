import { gql } from 'graphql-request';

import { UpdateUserInput, User } from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type UpdateUserResult = {
  updateUser: Pick<User, 'id' | 'name' | 'picture' | 'contentful_token_read'>;
};

const updateUser = async (
  input: UpdateUserInput,
  cookie?: string,
  authorization?: string,
): Promise<UpdateUserResult> => {
  const client = getClient(cookie, authorization);
  const mutation = gql`
    mutation UpdateUser($id: String!, $contentful_token_read: String) {
      updateUser(
        updateUser: { id: $id, contentful_token_read: $contentful_token_read }
      ) {
        id
        name
        picture
        contentful_token_read
      }
    }
  `;

  return client.request<UpdateUserResult>(mutation, input);
};

export default updateUser;
