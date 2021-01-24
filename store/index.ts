import { enableStaticRendering } from 'mobx-react-lite';
import { types, applySnapshot, Instance, SnapshotOut } from 'mobx-state-tree';

const isServer = typeof window === 'undefined';
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

export const User = types.model({
  id: types.string,
  name: types.string,
  picture: types.string,
  contentful_token_read: types.maybeNull(types.string),
});

export const Store = types
  .model('Store', {
    me: types.maybeNull(User),
  })
  .actions((self) => {
    const setMe = (me: Instance<typeof User>): void => {
      self.me = me;
    };

    return {
      setMe,
    };
  });

export type StoreInterface = Instance<typeof Store>;
export type StoreSnapshotInterface = SnapshotOut<typeof Store>;

let store: StoreInterface = null as any;

export function initializeStore(snapshot: any = null): StoreInterface {
  const isServer = typeof window === 'undefined';

  if (isServer || store === null) {
    store = Store.create({
      me: null,
    });
  }

  if (snapshot !== null) {
    applySnapshot(store, snapshot);
  }

  return store;
}
