import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { DocumentNode } from "graphql";

export const GET_COURSES: DocumentNode = gql`
  {
    myCourseRoles {
      id
      user_type
      course {
        id
        name
      }
    }
    me @client {
      isAdmin
      id
      name
      email
      photo
    }
  }
`;

export const CREATE_COURSE: DocumentNode = gql`
  mutation CreateCourse($name: String!, $description: String!) {
    createCourse(name: $name, description: $description) {
      name
      id
    }
  }
`;

export const CREATE_COURSE_MESSAGE: DocumentNode = gql`
  mutation CreateCourseMessage($body: String!, $course_id: String!) {
    createCourseMessage(body: $body, course_id: $course_id) {
      id
    }
  }
`;

export const COURSE_SEARCH: DocumentNode = gql`
  query UserSearch($searchString: String!, $courseId: String!) {
    userSearch(
      name: $searchString
      email: $searchString
      course_id: $courseId
    ) {
      name
      id
      photo
      nickname
      email
    }
  }
`;

export const COURSE_QUERY: DocumentNode = gql`
  query($id: ID!) {
    course(where: { id: $id }) {
      name
      description
      id
    }
  }
`;

export const COURSE_DESC_MUTATION: DocumentNode = gql`
  mutation($desc: String!, $id: String!) {
    updateCourseDescription(course_id: $id, description: $desc) {
      id
    }
  }
`;

export const COURSE_INFO: DocumentNode = gql`
  query Course($courseId: ID!) {
    course(where: { id: $courseId }) {
      id
      name
      title
      description
      term
      userRoles {
        id
        user_type
        user {
          id
          name
        }
      }
    }
  }
`;

export interface ICourse {
  id: string;
  name: string;
}

interface ICourseQueryResult {
  myCourseRoles: Array<{
    id: string;
    user_type: string;
    course: ICourse;
  }>;
  me: {
    isAdmin: boolean;
    id: string;
    name: string;
    email: string;
    photo: string;
  };
}

export class QueryGetCourses extends Query<ICourseQueryResult, {}> {}

export class CourseDescMutation extends Mutation<
  { id: string },
  { desc: string; id: string }
> {}
