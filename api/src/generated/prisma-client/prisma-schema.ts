export const typeDefs = /* GraphQL */ `type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

scalar Long

type Mutation {
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  iClickerID: String
  bio: String
  isAdmin: Boolean
  hasVisited: Boolean
  createdAt: DateTime!
  updatedAt: DateTime!
  acceptsEmails: Boolean
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  iClickerID: String
  bio: String
  isAdmin: Boolean
  hasVisited: Boolean
  acceptsEmails: Boolean
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  student_id_ASC
  student_id_DESC
  name_ASC
  name_DESC
  nickname_ASC
  nickname_DESC
  email_ASC
  email_DESC
  photo_ASC
  photo_DESC
  iClickerID_ASC
  iClickerID_DESC
  bio_ASC
  bio_DESC
  isAdmin_ASC
  isAdmin_DESC
  hasVisited_ASC
  hasVisited_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  acceptsEmails_ASC
  acceptsEmails_DESC
}

type UserPreviousValues {
  id: ID!
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  iClickerID: String
  bio: String
  isAdmin: Boolean
  hasVisited: Boolean
  createdAt: DateTime!
  updatedAt: DateTime!
  acceptsEmails: Boolean
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  student_id: Int
  name: String
  nickname: String
  email: String
  photo: String
  iClickerID: String
  bio: String
  isAdmin: Boolean
  hasVisited: Boolean
  acceptsEmails: Boolean
}

input UserUpdateManyMutationInput {
  student_id: Int
  name: String
  nickname: String
  email: String
  photo: String
  iClickerID: String
  bio: String
  isAdmin: Boolean
  hasVisited: Boolean
  acceptsEmails: Boolean
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  student_id: Int
  student_id_not: Int
  student_id_in: [Int!]
  student_id_not_in: [Int!]
  student_id_lt: Int
  student_id_lte: Int
  student_id_gt: Int
  student_id_gte: Int
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  nickname: String
  nickname_not: String
  nickname_in: [String!]
  nickname_not_in: [String!]
  nickname_lt: String
  nickname_lte: String
  nickname_gt: String
  nickname_gte: String
  nickname_contains: String
  nickname_not_contains: String
  nickname_starts_with: String
  nickname_not_starts_with: String
  nickname_ends_with: String
  nickname_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  photo: String
  photo_not: String
  photo_in: [String!]
  photo_not_in: [String!]
  photo_lt: String
  photo_lte: String
  photo_gt: String
  photo_gte: String
  photo_contains: String
  photo_not_contains: String
  photo_starts_with: String
  photo_not_starts_with: String
  photo_ends_with: String
  photo_not_ends_with: String
  iClickerID: String
  iClickerID_not: String
  iClickerID_in: [String!]
  iClickerID_not_in: [String!]
  iClickerID_lt: String
  iClickerID_lte: String
  iClickerID_gt: String
  iClickerID_gte: String
  iClickerID_contains: String
  iClickerID_not_contains: String
  iClickerID_starts_with: String
  iClickerID_not_starts_with: String
  iClickerID_ends_with: String
  iClickerID_not_ends_with: String
  bio: String
  bio_not: String
  bio_in: [String!]
  bio_not_in: [String!]
  bio_lt: String
  bio_lte: String
  bio_gt: String
  bio_gte: String
  bio_contains: String
  bio_not_contains: String
  bio_starts_with: String
  bio_not_starts_with: String
  bio_ends_with: String
  bio_not_ends_with: String
  isAdmin: Boolean
  isAdmin_not: Boolean
  hasVisited: Boolean
  hasVisited_not: Boolean
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime!]
  updatedAt_not_in: [DateTime!]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  acceptsEmails: Boolean
  acceptsEmails_not: Boolean
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`