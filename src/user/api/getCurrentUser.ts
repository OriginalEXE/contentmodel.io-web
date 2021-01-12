import { gql } from 'graphql-request';

import { User } from '@/src/generated/fragments';
import getClient from '@/src/graphql/getClient';

type GetCurrentUserResult = { me: Pick<User, 'id' | 'name' | 'picture'> };

const getCurrentUser = async (
  cookie?: string,
  authorization?: string,
): Promise<GetCurrentUserResult> => {
  const client = getClient(cookie, authorization);
  const query = gql`
    query {
      me {
        id
        name
        picture
      }
    }
  `;

  return client.request<GetCurrentUserResult>(query);
};

export default getCurrentUser;
