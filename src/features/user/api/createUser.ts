import { gql } from 'graphql-request';

import { CreateUserInput, Login } from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type CreateUserResult = { createUser: Pick<Login, 'createdAt' | 'fresh'> };

const createUser = async (
  input: CreateUserInput,
  cookie?: string,
  authorization?: string,
): Promise<CreateUserResult> => {
  const client = getClient(cookie, authorization);
  const mutation = gql`
    mutation CreateUser($email: String!, $name: String!, $picture: String!) {
      createUser(
        createUser: { email: $email, name: $name, picture: $picture }
      ) {
        createdAt
        fresh
      }
    }
  `;

  return client.request<CreateUserResult>(mutation, input);
};

export default createUser;
