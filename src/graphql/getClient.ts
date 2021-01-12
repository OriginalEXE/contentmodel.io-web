import { GraphQLClient } from 'graphql-request';

import { GRAPHQL_INTERNAL } from '@/src/shared/constants';

const getClient = (cookie?: string, authorization?: string): GraphQLClient => {
  const headers: Record<string, string> = {};

  if (typeof cookie !== 'undefined') {
    headers.cookie = cookie;
  }

  if (typeof authorization !== 'undefined') {
    headers.authorization = authorization;
  }

  return new GraphQLClient(GRAPHQL_INTERNAL, {
    headers,
  });
};

export default getClient;
