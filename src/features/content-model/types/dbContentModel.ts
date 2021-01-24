import { User, ContentModel } from '@/src/generated/fragments';

export type DbContentModel = Omit<ContentModel, 'userId'> & {
  user: Pick<User, 'id' | 'name' | 'picture'>;
};
