export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  email: Maybe<Scalars['String']>;
  name: Scalars['String'];
  contentful_token_read: Maybe<Scalars['String']>;
  picture: Scalars['String'];
};


export type Login = {
  __typename?: 'Login';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  auth0Id: Scalars['String'];
  fresh: Maybe<Scalars['Boolean']>;
  user: User;
};

export type ImageAsset = {
  __typename?: 'ImageAsset';
  src: Scalars['String'];
  path: Scalars['String'];
  width: Scalars['Float'];
  height: Scalars['Float'];
};

export type ContentModel = {
  __typename?: 'ContentModel';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  cms: Scalars['String'];
  slug: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  userId: Scalars['String'];
  user: User;
  model: Scalars['String'];
  position: Scalars['String'];
  visibility: Scalars['String'];
  ogMetaImage: Maybe<ImageAsset>;
  image: Maybe<ImageAsset>;
  imageNoConnections: Maybe<ImageAsset>;
  stars: Scalars['Float'];
  starred: Scalars['Boolean'];
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  hasNext: Scalars['Boolean'];
  hasPrev: Scalars['Boolean'];
  total: Scalars['Int'];
};

export type PaginatedContentModel = {
  __typename?: 'PaginatedContentModel';
  items: Array<ContentModel>;
  pagination: PaginationInfo;
};

export type Query = {
  __typename?: 'Query';
  me: Maybe<User>;
  contentModels: PaginatedContentModel;
  contentModelBySlug: Maybe<ContentModel>;
};


export type QueryContentModelsArgs = {
  visibility: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
};


export type QueryContentModelBySlugArgs = {
  secret?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: Login;
  updateUser: User;
  createContentModel: ContentModel;
  updateContentModel: ContentModel;
  deleteContentModel: ContentModel;
  starContentModel: ContentModel;
  unstarContentModel: ContentModel;
};


export type MutationCreateUserArgs = {
  createUser: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  updateUser: UpdateUserInput;
};


export type MutationCreateContentModelArgs = {
  createContentModel: CreateContentModelInput;
};


export type MutationUpdateContentModelArgs = {
  updateContentModel: UpdateContentModelInput;
};


export type MutationDeleteContentModelArgs = {
  deleteContentModel: DeleteContentModelInput;
};


export type MutationStarContentModelArgs = {
  starContentModel: StarContentModelInput;
};


export type MutationUnstarContentModelArgs = {
  unstarContentModel: UnstarContentModelInput;
};

export type CreateUserInput = {
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  id: Scalars['String'];
  contentful_token_read?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CreateContentModelInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  visibility?: Maybe<Scalars['String']>;
  version: CreateContentModelVersionInput;
};

export type CreateContentModelVersionInput = {
  model: Scalars['String'];
  position: Scalars['String'];
};

export type UpdateContentModelInput = {
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  visibility?: Maybe<Scalars['String']>;
  version?: Maybe<UpdateContentModelVersionInput>;
};

export type UpdateContentModelVersionInput = {
  model?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
};

export type DeleteContentModelInput = {
  id: Scalars['String'];
};

export type StarContentModelInput = {
  id: Scalars['String'];
};

export type UnstarContentModelInput = {
  id: Scalars['String'];
};
