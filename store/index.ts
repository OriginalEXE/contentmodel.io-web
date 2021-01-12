import { enableStaticRendering } from 'mobx-react-lite';
import { types, applySnapshot, Instance, SnapshotOut } from 'mobx-state-tree';

const isServer = typeof window === 'undefined';
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

export const User = types.model({
  id: types.string,
  name: types.string,
  picture: types.string,
});

const Sys = types.model({
  id: types.string,
  type: types.string,
  linkType: types.string,
});

const ContentTypeSys = types.model({
  space: types.model({
    sys: Sys,
  }),
  id: types.string,
  type: types.string,
  createdAt: types.string,
  updatedAt: types.string,
  environment: types.model({
    sys: Sys,
  }),
  revision: types.number,
});

const ContentTypeField = types.model({
  id: types.string,
  name: types.string,
  type: types.string,
  localized: types.boolean,
  required: types.boolean,
  disabled: types.boolean,
  omitted: types.boolean,
  linkType: types.maybeNull(types.string),
});

export const ContentType = types.model({
  sys: ContentTypeSys,
  name: types.string,
  displayField: types.string,
  description: types.maybeNull(types.string),
  fields: types.array(ContentTypeField),
});

export const Store = types
  .model('Store', {
    me: types.maybeNull(User),
    contentModel: types.array(ContentType),
  })
  .actions((self) => {
    const setMe = ({
      id,
      name,
      picture,
    }: {
      id: string;
      name: string;
      picture: string;
    }): void => {
      self.me = {
        id,
        name,
        picture,
      };
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
      contentModel: [
        {
          sys: {
            space: {
              sys: {
                type: 'Link',
                linkType: 'Space',
                id: 'gvtzxzs05yez',
              },
            },
            id: 'blogPost',
            type: 'ContentType',
            createdAt: '2019-07-28T08:42:15.063Z',
            updatedAt: '2020-10-14T21:31:14.252Z',
            environment: {
              sys: {
                id: 'master',
                type: 'Link',
                linkType: 'Environment',
              },
            },
            revision: 13,
          },
          displayField: 'title',
          name: 'Blog Post',
          description: null,
          fields: [
            {
              id: 'title',
              name: 'Title',
              type: 'Symbol',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'slug',
              name: 'Slug',
              type: 'Symbol',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'heroImage',
              name: 'Hero Image',
              type: 'Link',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
              linkType: 'Asset',
            },
            {
              id: 'description',
              name: 'Description',
              type: 'Text',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'body',
              name: 'Body',
              type: 'Text',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'author',
              name: 'Author',
              type: 'Link',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
              linkType: 'Entry',
            },
            {
              id: 'publishDate',
              name: 'Publish Date',
              type: 'Date',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'tags',
              name: 'Tags',
              type: 'Array',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
              items: {
                type: 'Symbol',
                validations: [
                  {
                    in: ['general', 'javascript', 'static-sites'],
                  },
                ],
              },
            },
            {
              id: 'test',
              name: 'Test',
              type: 'Location',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
            },
          ],
        },
        {
          sys: {
            space: {
              sys: {
                type: 'Link',
                linkType: 'Space',
                id: 'gvtzxzs05yez',
              },
            },
            id: 'person',
            type: 'ContentType',
            createdAt: '2019-07-28T08:42:15.036Z',
            updatedAt: '2019-07-28T08:42:15.036Z',
            environment: {
              sys: {
                id: 'master',
                type: 'Link',
                linkType: 'Environment',
              },
            },
            revision: 1,
          },
          displayField: 'name',
          name: 'Person',
          description: null,
          fields: [
            {
              id: 'name',
              name: 'Name',
              type: 'Symbol',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'title',
              name: 'Title',
              type: 'Symbol',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'company',
              name: 'Company',
              type: 'Symbol',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'shortBio',
              name: 'Short Bio',
              type: 'Text',
              localized: false,
              required: true,
              disabled: false,
              omitted: false,
            },
            {
              id: 'email',
              name: 'Email',
              type: 'Symbol',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
            },
            {
              id: 'phone',
              name: 'Phone',
              type: 'Symbol',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
            },
            {
              id: 'facebook',
              name: 'Facebook',
              type: 'Symbol',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
            },
            {
              id: 'twitter',
              name: 'Twitter',
              type: 'Symbol',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
            },
            {
              id: 'github',
              name: 'Github',
              type: 'Symbol',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
            },
            {
              id: 'image',
              name: 'Image',
              type: 'Link',
              localized: false,
              required: false,
              disabled: false,
              omitted: false,
              linkType: 'Asset',
            },
          ],
        },
      ],
    });
  }

  if (snapshot !== null) {
    applySnapshot(store, snapshot);
  }

  return store;
}
