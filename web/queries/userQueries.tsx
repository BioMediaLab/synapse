import gql from "graphql-tag";
import { Query } from "react-apollo";
import { DocumentNode } from "graphql";

export const REMOVE_ADMIN = gql`
  mutation($myId: String!) {
    promoteUser(id: $myId, admin: false) {
      id
    }
  }
`;
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
  mutation($courseId: String!, $userIds: [String]!) {
    removeUsersFromCourse(course_id: $courseId, user_ids: $userIds) {
      id
    }
  }
`;
export const READ_USERS: DocumentNode = gql`
  query($courseId: ID!, $startOn: String, $numRecords: Int) {
    course(where: { id: $courseId }) {
      id
      users(after: $startOn, first: $numRecords, orderBy: name_ASC) {
        id
        name
        email
        photo
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
      courses {
        id
        name
      }
      name
      email
      photo
    }
  }
`;

export interface IQueryVars {
  courseId: string;
  startOn: string;
  numRecords: number;
}

export interface IQueryResult {
  course: {
    id: string;
    users: Array<{ id: string; name: string; email: string; photo: string }>;
  };
}
export interface IUser {
  value: string;
  label: string;
  name: string;
  photo: string;
  nickname: string;
  email: string;
  id: string;
}
