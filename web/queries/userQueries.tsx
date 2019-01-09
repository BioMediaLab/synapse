import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { DocumentNode } from "graphql";

export const GET_ME = gql`
  {
    me @client {
      isAdmin
      id
      name
      email
      photo
    }
  }
`;

export const SEARCH = gql`
  query UserSearch($searchString: String!) {
    userSearch(name: $searchString, email: $searchString) {
      id
      email
      name
      photo
      nickname
    }
  }
`;

export const REMOVE_USER_MUTATION = gql`
  mutation($courseId: String!, $userId: String!) {
    removeUserFromCourse(course_id: $courseId, user_id: $userId) {
      id
    }
  }
`;

export const REMOVE_ADMIN = gql`
  mutation($myId: String!) {
    promoteUser(id: $myId, admin: false) {
      id
    }
  }
`;

export interface IUser {
  value: string;
  label: string;
  name: string;
  photo: string;
  nickname: string;
  email: string;
  id: string;
}

export interface IReadCourseUsersQueryVars {
  courseId: string;
  startOn: string;
  numRecords: number;
}

export interface IRreadCourseResult {
  course: {
    id: string;
    userRoles: Array<{
      id: string;
      user: IUser;
    }>;
  };
}

export const READ_COURSE_USERS: DocumentNode = gql`
  query($courseId: ID!, $startOn: String, $numRecords: Int) {
    course(where: { id: $courseId }) {
      id
      userRoles(after: $startOn, first: $numRecords) {
        id
        user {
          id
          name
          email
          photo
        }
      }
    }
  }
`;

export const MY_ID = gql`
  {
    me @client {
      id
    }
  }
`;

export const GET_USER = gql`
  query user($userID: UserWhereUniqueInput!) {
    user(where: $userID) {
      id
      courseRoles {
        id
        course {
          name
        }
      }
      name
      email
      photo
    }
  }
`;

interface IUserQueryVars {
  userID: string;
}

// only use with GET_USERS
export class UserQueryComp extends Query<any, IUserQueryVars> {}

export class UserMutationComp extends Mutation {}
