import { QueryClient } from 'react-query';

const getQueryClient = (): QueryClient => {
  return new QueryClient();
};

export default getQueryClient;
