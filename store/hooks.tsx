import React from 'react';

import { StoreInterface } from '@/store';

// Main store
const storeContext = React.createContext({} as StoreInterface);

export const StoreProvider = ({
  store,
  children,
}: {
  store: StoreInterface;
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = (): StoreInterface => {
  const store = React.useContext(storeContext);

  if (!store) {
    throw new Error('You did not use the StoreProvider');
  }

  return store;
};
