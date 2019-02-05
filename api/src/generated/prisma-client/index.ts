// Code generated by Prisma (prisma@1.25.7). DO NOT EDIT.
// Please don't change this file manually but run `prisma generate` to update it.
// For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

import { DocumentNode } from "graphql";
import {
  makePrismaClientClass,
  BaseClientOptions,
  Model
} from "prisma-client-lib";
import { typeDefs } from "./prisma-schema";

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export interface Exists {
  user: (where?: UserWhereInput) => Promise<boolean>;
}

export interface Node {}

export type FragmentableArray<T> = Promise<Array<T>> & Fragmentable;

export interface Fragmentable {
  $fragment<T>(fragment: string | DocumentNode): Promise<T>;
}

export interface Prisma {
  $exists: Exists;
  $graphql: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;

  /**
   * Queries
   */

  user: (where: UserWhereUniqueInput) => UserPromise;
  users: (
    args?: {
      where?: UserWhereInput;
      orderBy?: UserOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<User>;
  usersConnection: (
    args?: {
      where?: UserWhereInput;
      orderBy?: UserOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => UserConnectionPromise;
  node: (args: { id: ID_Output }) => Node;

  /**
   * Mutations
   */

  createUser: (data: UserCreateInput) => UserPromise;
  updateUser: (
    args: { data: UserUpdateInput; where: UserWhereUniqueInput }
  ) => UserPromise;
  updateManyUsers: (
    args: { data: UserUpdateManyMutationInput; where?: UserWhereInput }
  ) => BatchPayloadPromise;
  upsertUser: (
    args: {
      where: UserWhereUniqueInput;
      create: UserCreateInput;
      update: UserUpdateInput;
    }
  ) => UserPromise;
  deleteUser: (where: UserWhereUniqueInput) => UserPromise;
  deleteManyUsers: (where?: UserWhereInput) => BatchPayloadPromise;

  /**
   * Subscriptions
   */

  $subscribe: Subscription;
}

export interface Subscription {
  user: (
    where?: UserSubscriptionWhereInput
  ) => UserSubscriptionPayloadSubscription;
}

export interface ClientConstructor<T> {
  new (options?: BaseClientOptions): T;
}

/**
 * Types
 */

export type UserOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "student_id_ASC"
  | "student_id_DESC"
  | "name_ASC"
  | "name_DESC"
  | "nickname_ASC"
  | "nickname_DESC"
  | "email_ASC"
  | "email_DESC"
  | "photo_ASC"
  | "photo_DESC"
  | "iClickerID_ASC"
  | "iClickerID_DESC"
  | "bio_ASC"
  | "bio_DESC"
  | "isAdmin_ASC"
  | "isAdmin_DESC"
  | "hasVisited_ASC"
  | "hasVisited_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "acceptsEmails_ASC"
  | "acceptsEmails_DESC";

export type MutationType = "CREATED" | "UPDATED" | "DELETED";

export type UserWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
  email?: String;
}>;

export interface UserWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  student_id?: Int;
  student_id_not?: Int;
  student_id_in?: Int[] | Int;
  student_id_not_in?: Int[] | Int;
  student_id_lt?: Int;
  student_id_lte?: Int;
  student_id_gt?: Int;
  student_id_gte?: Int;
  name?: String;
  name_not?: String;
  name_in?: String[] | String;
  name_not_in?: String[] | String;
  name_lt?: String;
  name_lte?: String;
  name_gt?: String;
  name_gte?: String;
  name_contains?: String;
  name_not_contains?: String;
  name_starts_with?: String;
  name_not_starts_with?: String;
  name_ends_with?: String;
  name_not_ends_with?: String;
  nickname?: String;
  nickname_not?: String;
  nickname_in?: String[] | String;
  nickname_not_in?: String[] | String;
  nickname_lt?: String;
  nickname_lte?: String;
  nickname_gt?: String;
  nickname_gte?: String;
  nickname_contains?: String;
  nickname_not_contains?: String;
  nickname_starts_with?: String;
  nickname_not_starts_with?: String;
  nickname_ends_with?: String;
  nickname_not_ends_with?: String;
  email?: String;
  email_not?: String;
  email_in?: String[] | String;
  email_not_in?: String[] | String;
  email_lt?: String;
  email_lte?: String;
  email_gt?: String;
  email_gte?: String;
  email_contains?: String;
  email_not_contains?: String;
  email_starts_with?: String;
  email_not_starts_with?: String;
  email_ends_with?: String;
  email_not_ends_with?: String;
  photo?: String;
  photo_not?: String;
  photo_in?: String[] | String;
  photo_not_in?: String[] | String;
  photo_lt?: String;
  photo_lte?: String;
  photo_gt?: String;
  photo_gte?: String;
  photo_contains?: String;
  photo_not_contains?: String;
  photo_starts_with?: String;
  photo_not_starts_with?: String;
  photo_ends_with?: String;
  photo_not_ends_with?: String;
  iClickerID?: String;
  iClickerID_not?: String;
  iClickerID_in?: String[] | String;
  iClickerID_not_in?: String[] | String;
  iClickerID_lt?: String;
  iClickerID_lte?: String;
  iClickerID_gt?: String;
  iClickerID_gte?: String;
  iClickerID_contains?: String;
  iClickerID_not_contains?: String;
  iClickerID_starts_with?: String;
  iClickerID_not_starts_with?: String;
  iClickerID_ends_with?: String;
  iClickerID_not_ends_with?: String;
  bio?: String;
  bio_not?: String;
  bio_in?: String[] | String;
  bio_not_in?: String[] | String;
  bio_lt?: String;
  bio_lte?: String;
  bio_gt?: String;
  bio_gte?: String;
  bio_contains?: String;
  bio_not_contains?: String;
  bio_starts_with?: String;
  bio_not_starts_with?: String;
  bio_ends_with?: String;
  bio_not_ends_with?: String;
  isAdmin?: Boolean;
  isAdmin_not?: Boolean;
  hasVisited?: Boolean;
  hasVisited_not?: Boolean;
  createdAt?: DateTimeInput;
  createdAt_not?: DateTimeInput;
  createdAt_in?: DateTimeInput[] | DateTimeInput;
  createdAt_not_in?: DateTimeInput[] | DateTimeInput;
  createdAt_lt?: DateTimeInput;
  createdAt_lte?: DateTimeInput;
  createdAt_gt?: DateTimeInput;
  createdAt_gte?: DateTimeInput;
  updatedAt?: DateTimeInput;
  updatedAt_not?: DateTimeInput;
  updatedAt_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_not_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_lt?: DateTimeInput;
  updatedAt_lte?: DateTimeInput;
  updatedAt_gt?: DateTimeInput;
  updatedAt_gte?: DateTimeInput;
  acceptsEmails?: Boolean;
  acceptsEmails_not?: Boolean;
  AND?: UserWhereInput[] | UserWhereInput;
  OR?: UserWhereInput[] | UserWhereInput;
  NOT?: UserWhereInput[] | UserWhereInput;
}

export interface UserCreateInput {
  student_id?: Int;
  name: String;
  nickname?: String;
  email: String;
  photo?: String;
  iClickerID?: String;
  bio?: String;
  isAdmin?: Boolean;
  hasVisited?: Boolean;
  acceptsEmails?: Boolean;
}

export interface UserUpdateInput {
  student_id?: Int;
  name?: String;
  nickname?: String;
  email?: String;
  photo?: String;
  iClickerID?: String;
  bio?: String;
  isAdmin?: Boolean;
  hasVisited?: Boolean;
  acceptsEmails?: Boolean;
}

export interface UserUpdateManyMutationInput {
  student_id?: Int;
  name?: String;
  nickname?: String;
  email?: String;
  photo?: String;
  iClickerID?: String;
  bio?: String;
  isAdmin?: Boolean;
  hasVisited?: Boolean;
  acceptsEmails?: Boolean;
}

export interface UserSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: UserWhereInput;
  AND?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
  OR?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
  NOT?: UserSubscriptionWhereInput[] | UserSubscriptionWhereInput;
}

export interface NodeNode {
  id: ID_Output;
}

export interface User {
  id: ID_Output;
  student_id?: Int;
  name: String;
  nickname?: String;
  email: String;
  photo?: String;
  iClickerID?: String;
  bio?: String;
  isAdmin?: Boolean;
  hasVisited?: Boolean;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
  acceptsEmails?: Boolean;
}

export interface UserPromise extends Promise<User>, Fragmentable {
  id: () => Promise<ID_Output>;
  student_id: () => Promise<Int>;
  name: () => Promise<String>;
  nickname: () => Promise<String>;
  email: () => Promise<String>;
  photo: () => Promise<String>;
  iClickerID: () => Promise<String>;
  bio: () => Promise<String>;
  isAdmin: () => Promise<Boolean>;
  hasVisited: () => Promise<Boolean>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
  acceptsEmails: () => Promise<Boolean>;
}

export interface UserSubscription
  extends Promise<AsyncIterator<User>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  student_id: () => Promise<AsyncIterator<Int>>;
  name: () => Promise<AsyncIterator<String>>;
  nickname: () => Promise<AsyncIterator<String>>;
  email: () => Promise<AsyncIterator<String>>;
  photo: () => Promise<AsyncIterator<String>>;
  iClickerID: () => Promise<AsyncIterator<String>>;
  bio: () => Promise<AsyncIterator<String>>;
  isAdmin: () => Promise<AsyncIterator<Boolean>>;
  hasVisited: () => Promise<AsyncIterator<Boolean>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  acceptsEmails: () => Promise<AsyncIterator<Boolean>>;
}

export interface UserConnection {
  pageInfo: PageInfo;
  edges: UserEdge[];
}

export interface UserConnectionPromise
  extends Promise<UserConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<UserEdge>>() => T;
  aggregate: <T = AggregateUserPromise>() => T;
}

export interface UserConnectionSubscription
  extends Promise<AsyncIterator<UserConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<UserEdgeSubscription>>>() => T;
  aggregate: <T = AggregateUserSubscription>() => T;
}

export interface PageInfo {
  hasNextPage: Boolean;
  hasPreviousPage: Boolean;
  startCursor?: String;
  endCursor?: String;
}

export interface PageInfoPromise extends Promise<PageInfo>, Fragmentable {
  hasNextPage: () => Promise<Boolean>;
  hasPreviousPage: () => Promise<Boolean>;
  startCursor: () => Promise<String>;
  endCursor: () => Promise<String>;
}

export interface PageInfoSubscription
  extends Promise<AsyncIterator<PageInfo>>,
    Fragmentable {
  hasNextPage: () => Promise<AsyncIterator<Boolean>>;
  hasPreviousPage: () => Promise<AsyncIterator<Boolean>>;
  startCursor: () => Promise<AsyncIterator<String>>;
  endCursor: () => Promise<AsyncIterator<String>>;
}

export interface UserEdge {
  node: User;
  cursor: String;
}

export interface UserEdgePromise extends Promise<UserEdge>, Fragmentable {
  node: <T = UserPromise>() => T;
  cursor: () => Promise<String>;
}

export interface UserEdgeSubscription
  extends Promise<AsyncIterator<UserEdge>>,
    Fragmentable {
  node: <T = UserSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface AggregateUser {
  count: Int;
}

export interface AggregateUserPromise
  extends Promise<AggregateUser>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateUserSubscription
  extends Promise<AsyncIterator<AggregateUser>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface BatchPayload {
  count: Long;
}

export interface BatchPayloadPromise
  extends Promise<BatchPayload>,
    Fragmentable {
  count: () => Promise<Long>;
}

export interface BatchPayloadSubscription
  extends Promise<AsyncIterator<BatchPayload>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Long>>;
}

export interface UserSubscriptionPayload {
  mutation: MutationType;
  node: User;
  updatedFields: String[];
  previousValues: UserPreviousValues;
}

export interface UserSubscriptionPayloadPromise
  extends Promise<UserSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = UserPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = UserPreviousValuesPromise>() => T;
}

export interface UserSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<UserSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = UserSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = UserPreviousValuesSubscription>() => T;
}

export interface UserPreviousValues {
  id: ID_Output;
  student_id?: Int;
  name: String;
  nickname?: String;
  email: String;
  photo?: String;
  iClickerID?: String;
  bio?: String;
  isAdmin?: Boolean;
  hasVisited?: Boolean;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
  acceptsEmails?: Boolean;
}

export interface UserPreviousValuesPromise
  extends Promise<UserPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  student_id: () => Promise<Int>;
  name: () => Promise<String>;
  nickname: () => Promise<String>;
  email: () => Promise<String>;
  photo: () => Promise<String>;
  iClickerID: () => Promise<String>;
  bio: () => Promise<String>;
  isAdmin: () => Promise<Boolean>;
  hasVisited: () => Promise<Boolean>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
  acceptsEmails: () => Promise<Boolean>;
}

export interface UserPreviousValuesSubscription
  extends Promise<AsyncIterator<UserPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  student_id: () => Promise<AsyncIterator<Int>>;
  name: () => Promise<AsyncIterator<String>>;
  nickname: () => Promise<AsyncIterator<String>>;
  email: () => Promise<AsyncIterator<String>>;
  photo: () => Promise<AsyncIterator<String>>;
  iClickerID: () => Promise<AsyncIterator<String>>;
  bio: () => Promise<AsyncIterator<String>>;
  isAdmin: () => Promise<AsyncIterator<Boolean>>;
  hasVisited: () => Promise<AsyncIterator<Boolean>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  acceptsEmails: () => Promise<AsyncIterator<Boolean>>;
}

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number;

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

/*
DateTime scalar input type, allowing Date
*/
export type DateTimeInput = Date | string;

/*
DateTime scalar output type, which is always a string
*/
export type DateTimeOutput = string;

export type Long = string;

/**
 * Model Metadata
 */

export const models: Model[] = [
  {
    name: "User",
    embedded: false
  }
];

/**
 * Type Defs
 */

export const Prisma = makePrismaClientClass<ClientConstructor<Prisma>>({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA_ENDPOINT"]}`,
  secret: `${process.env["PRISMA_SECRET"]}`
});
export const prisma = new Prisma();
