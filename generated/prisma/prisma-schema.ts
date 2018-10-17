export const typeDefs = /* GraphQL */ `type Activation {
  id: ID!
  activation_code: String!
  course: Course!
  user: User
  activatedAt: DateTime!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ActivationConnection {
  pageInfo: PageInfo!
  edges: [ActivationEdge]!
  aggregate: AggregateActivation!
}

input ActivationCreateInput {
  activation_code: String!
  course: CourseCreateOneWithoutActivationsInput!
  user: UserCreateOneWithoutActivationsInput
  activatedAt: DateTime!
}

input ActivationCreateManyWithoutCourseInput {
  create: [ActivationCreateWithoutCourseInput!]
  connect: [ActivationWhereUniqueInput!]
}

input ActivationCreateManyWithoutUserInput {
  create: [ActivationCreateWithoutUserInput!]
  connect: [ActivationWhereUniqueInput!]
}

input ActivationCreateWithoutCourseInput {
  activation_code: String!
  user: UserCreateOneWithoutActivationsInput
  activatedAt: DateTime!
}

input ActivationCreateWithoutUserInput {
  activation_code: String!
  course: CourseCreateOneWithoutActivationsInput!
  activatedAt: DateTime!
}

type ActivationEdge {
  node: Activation!
  cursor: String!
}

enum ActivationOrderByInput {
  id_ASC
  id_DESC
  activation_code_ASC
  activation_code_DESC
  activatedAt_ASC
  activatedAt_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ActivationPreviousValues {
  id: ID!
  activation_code: String!
  activatedAt: DateTime!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ActivationSubscriptionPayload {
  mutation: MutationType!
  node: Activation
  updatedFields: [String!]
  previousValues: ActivationPreviousValues
}

input ActivationSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ActivationWhereInput
  AND: [ActivationSubscriptionWhereInput!]
  OR: [ActivationSubscriptionWhereInput!]
  NOT: [ActivationSubscriptionWhereInput!]
}

input ActivationUpdateInput {
  activation_code: String
  course: CourseUpdateOneRequiredWithoutActivationsInput
  user: UserUpdateOneWithoutActivationsInput
  activatedAt: DateTime
}

input ActivationUpdateManyWithoutCourseInput {
  create: [ActivationCreateWithoutCourseInput!]
  delete: [ActivationWhereUniqueInput!]
  connect: [ActivationWhereUniqueInput!]
  disconnect: [ActivationWhereUniqueInput!]
  update: [ActivationUpdateWithWhereUniqueWithoutCourseInput!]
  upsert: [ActivationUpsertWithWhereUniqueWithoutCourseInput!]
}

input ActivationUpdateManyWithoutUserInput {
  create: [ActivationCreateWithoutUserInput!]
  delete: [ActivationWhereUniqueInput!]
  connect: [ActivationWhereUniqueInput!]
  disconnect: [ActivationWhereUniqueInput!]
  update: [ActivationUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [ActivationUpsertWithWhereUniqueWithoutUserInput!]
}

input ActivationUpdateWithoutCourseDataInput {
  activation_code: String
  user: UserUpdateOneWithoutActivationsInput
  activatedAt: DateTime
}

input ActivationUpdateWithoutUserDataInput {
  activation_code: String
  course: CourseUpdateOneRequiredWithoutActivationsInput
  activatedAt: DateTime
}

input ActivationUpdateWithWhereUniqueWithoutCourseInput {
  where: ActivationWhereUniqueInput!
  data: ActivationUpdateWithoutCourseDataInput!
}

input ActivationUpdateWithWhereUniqueWithoutUserInput {
  where: ActivationWhereUniqueInput!
  data: ActivationUpdateWithoutUserDataInput!
}

input ActivationUpsertWithWhereUniqueWithoutCourseInput {
  where: ActivationWhereUniqueInput!
  update: ActivationUpdateWithoutCourseDataInput!
  create: ActivationCreateWithoutCourseInput!
}

input ActivationUpsertWithWhereUniqueWithoutUserInput {
  where: ActivationWhereUniqueInput!
  update: ActivationUpdateWithoutUserDataInput!
  create: ActivationCreateWithoutUserInput!
}

input ActivationWhereInput {
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
  activation_code: String
  activation_code_not: String
  activation_code_in: [String!]
  activation_code_not_in: [String!]
  activation_code_lt: String
  activation_code_lte: String
  activation_code_gt: String
  activation_code_gte: String
  activation_code_contains: String
  activation_code_not_contains: String
  activation_code_starts_with: String
  activation_code_not_starts_with: String
  activation_code_ends_with: String
  activation_code_not_ends_with: String
  course: CourseWhereInput
  user: UserWhereInput
  activatedAt: DateTime
  activatedAt_not: DateTime
  activatedAt_in: [DateTime!]
  activatedAt_not_in: [DateTime!]
  activatedAt_lt: DateTime
  activatedAt_lte: DateTime
  activatedAt_gt: DateTime
  activatedAt_gte: DateTime
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
  AND: [ActivationWhereInput!]
  OR: [ActivationWhereInput!]
  NOT: [ActivationWhereInput!]
}

input ActivationWhereUniqueInput {
  id: ID
  activation_code: String
}

type AggregateActivation {
  count: Int!
}

type AggregateCourse {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Course {
  id: ID!
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User!]
  name: String!
  description: String
  activations(where: ActivationWhereInput, orderBy: ActivationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Activation!]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CourseConnection {
  pageInfo: PageInfo!
  edges: [CourseEdge]!
  aggregate: AggregateCourse!
}

input CourseCreateInput {
  users: UserCreateManyWithoutCoursesInput
  name: String!
  description: String
  activations: ActivationCreateManyWithoutCourseInput
}

input CourseCreateManyWithoutUsersInput {
  create: [CourseCreateWithoutUsersInput!]
  connect: [CourseWhereUniqueInput!]
}

input CourseCreateOneWithoutActivationsInput {
  create: CourseCreateWithoutActivationsInput
  connect: CourseWhereUniqueInput
}

input CourseCreateWithoutActivationsInput {
  users: UserCreateManyWithoutCoursesInput
  name: String!
  description: String
}

input CourseCreateWithoutUsersInput {
  name: String!
  description: String
  activations: ActivationCreateManyWithoutCourseInput
}

type CourseEdge {
  node: Course!
  cursor: String!
}

enum CourseOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  description_ASC
  description_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type CoursePreviousValues {
  id: ID!
  name: String!
  description: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CourseSubscriptionPayload {
  mutation: MutationType!
  node: Course
  updatedFields: [String!]
  previousValues: CoursePreviousValues
}

input CourseSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: CourseWhereInput
  AND: [CourseSubscriptionWhereInput!]
  OR: [CourseSubscriptionWhereInput!]
  NOT: [CourseSubscriptionWhereInput!]
}

input CourseUpdateInput {
  users: UserUpdateManyWithoutCoursesInput
  name: String
  description: String
  activations: ActivationUpdateManyWithoutCourseInput
}

input CourseUpdateManyWithoutUsersInput {
  create: [CourseCreateWithoutUsersInput!]
  delete: [CourseWhereUniqueInput!]
  connect: [CourseWhereUniqueInput!]
  disconnect: [CourseWhereUniqueInput!]
  update: [CourseUpdateWithWhereUniqueWithoutUsersInput!]
  upsert: [CourseUpsertWithWhereUniqueWithoutUsersInput!]
}

input CourseUpdateOneRequiredWithoutActivationsInput {
  create: CourseCreateWithoutActivationsInput
  update: CourseUpdateWithoutActivationsDataInput
  upsert: CourseUpsertWithoutActivationsInput
  connect: CourseWhereUniqueInput
}

input CourseUpdateWithoutActivationsDataInput {
  users: UserUpdateManyWithoutCoursesInput
  name: String
  description: String
}

input CourseUpdateWithoutUsersDataInput {
  name: String
  description: String
  activations: ActivationUpdateManyWithoutCourseInput
}

input CourseUpdateWithWhereUniqueWithoutUsersInput {
  where: CourseWhereUniqueInput!
  data: CourseUpdateWithoutUsersDataInput!
}

input CourseUpsertWithoutActivationsInput {
  update: CourseUpdateWithoutActivationsDataInput!
  create: CourseCreateWithoutActivationsInput!
}

input CourseUpsertWithWhereUniqueWithoutUsersInput {
  where: CourseWhereUniqueInput!
  update: CourseUpdateWithoutUsersDataInput!
  create: CourseCreateWithoutUsersInput!
}

input CourseWhereInput {
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
  users_every: UserWhereInput
  users_some: UserWhereInput
  users_none: UserWhereInput
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
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  activations_every: ActivationWhereInput
  activations_some: ActivationWhereInput
  activations_none: ActivationWhereInput
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
  AND: [CourseWhereInput!]
  OR: [CourseWhereInput!]
  NOT: [CourseWhereInput!]
}

input CourseWhereUniqueInput {
  id: ID
}

scalar DateTime

scalar Long

type Mutation {
  createActivation(data: ActivationCreateInput!): Activation!
  updateActivation(data: ActivationUpdateInput!, where: ActivationWhereUniqueInput!): Activation
  updateManyActivations(data: ActivationUpdateInput!, where: ActivationWhereInput): BatchPayload!
  upsertActivation(where: ActivationWhereUniqueInput!, create: ActivationCreateInput!, update: ActivationUpdateInput!): Activation!
  deleteActivation(where: ActivationWhereUniqueInput!): Activation
  deleteManyActivations(where: ActivationWhereInput): BatchPayload!
  createCourse(data: CourseCreateInput!): Course!
  updateCourse(data: CourseUpdateInput!, where: CourseWhereUniqueInput!): Course
  updateManyCourses(data: CourseUpdateInput!, where: CourseWhereInput): BatchPayload!
  upsertCourse(where: CourseWhereUniqueInput!, create: CourseCreateInput!, update: CourseUpdateInput!): Course!
  deleteCourse(where: CourseWhereUniqueInput!): Course
  deleteManyCourses(where: CourseWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateInput!, where: UserWhereInput): BatchPayload!
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
  activation(where: ActivationWhereUniqueInput!): Activation
  activations(where: ActivationWhereInput, orderBy: ActivationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Activation]!
  activationsConnection(where: ActivationWhereInput, orderBy: ActivationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ActivationConnection!
  course(where: CourseWhereUniqueInput!): Course
  courses(where: CourseWhereInput, orderBy: CourseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Course]!
  coursesConnection(where: CourseWhereInput, orderBy: CourseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CourseConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  activation(where: ActivationSubscriptionWhereInput): ActivationSubscriptionPayload
  course(where: CourseSubscriptionWhereInput): CourseSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  courses(where: CourseWhereInput, orderBy: CourseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Course!]
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  isAdmin: Boolean
  createdAt: DateTime!
  updatedAt: DateTime!
  activations(where: ActivationWhereInput, orderBy: ActivationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Activation!]
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  courses: CourseCreateManyWithoutUsersInput
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  isAdmin: Boolean
  activations: ActivationCreateManyWithoutUserInput
}

input UserCreateManyWithoutCoursesInput {
  create: [UserCreateWithoutCoursesInput!]
  connect: [UserWhereUniqueInput!]
}

input UserCreateOneWithoutActivationsInput {
  create: UserCreateWithoutActivationsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutActivationsInput {
  courses: CourseCreateManyWithoutUsersInput
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  isAdmin: Boolean
}

input UserCreateWithoutCoursesInput {
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  isAdmin: Boolean
  activations: ActivationCreateManyWithoutUserInput
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
  isAdmin_ASC
  isAdmin_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type UserPreviousValues {
  id: ID!
  student_id: Int
  name: String!
  nickname: String
  email: String!
  photo: String
  isAdmin: Boolean
  createdAt: DateTime!
  updatedAt: DateTime!
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
  courses: CourseUpdateManyWithoutUsersInput
  student_id: Int
  name: String
  nickname: String
  email: String
  photo: String
  isAdmin: Boolean
  activations: ActivationUpdateManyWithoutUserInput
}

input UserUpdateManyWithoutCoursesInput {
  create: [UserCreateWithoutCoursesInput!]
  delete: [UserWhereUniqueInput!]
  connect: [UserWhereUniqueInput!]
  disconnect: [UserWhereUniqueInput!]
  update: [UserUpdateWithWhereUniqueWithoutCoursesInput!]
  upsert: [UserUpsertWithWhereUniqueWithoutCoursesInput!]
}

input UserUpdateOneWithoutActivationsInput {
  create: UserCreateWithoutActivationsInput
  update: UserUpdateWithoutActivationsDataInput
  upsert: UserUpsertWithoutActivationsInput
  delete: Boolean
  disconnect: Boolean
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutActivationsDataInput {
  courses: CourseUpdateManyWithoutUsersInput
  student_id: Int
  name: String
  nickname: String
  email: String
  photo: String
  isAdmin: Boolean
}

input UserUpdateWithoutCoursesDataInput {
  student_id: Int
  name: String
  nickname: String
  email: String
  photo: String
  isAdmin: Boolean
  activations: ActivationUpdateManyWithoutUserInput
}

input UserUpdateWithWhereUniqueWithoutCoursesInput {
  where: UserWhereUniqueInput!
  data: UserUpdateWithoutCoursesDataInput!
}

input UserUpsertWithoutActivationsInput {
  update: UserUpdateWithoutActivationsDataInput!
  create: UserCreateWithoutActivationsInput!
}

input UserUpsertWithWhereUniqueWithoutCoursesInput {
  where: UserWhereUniqueInput!
  update: UserUpdateWithoutCoursesDataInput!
  create: UserCreateWithoutCoursesInput!
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
  courses_every: CourseWhereInput
  courses_some: CourseWhereInput
  courses_none: CourseWhereInput
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
  isAdmin: Boolean
  isAdmin_not: Boolean
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
  activations_every: ActivationWhereInput
  activations_some: ActivationWhereInput
  activations_none: ActivationWhereInput
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  student_id: Int
  email: String
}
`