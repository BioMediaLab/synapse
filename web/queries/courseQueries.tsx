import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

export const GET_COURSES = gql`
  {
    courses {
      id
      name
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
export const CREATE_COURSE = gql`
  mutation CreateCourse($name: String!, $description: String!) {
    createCourse(name: $name, description: $description) {
      name
      id
    }
  }
`;
export const CREATE_COURSE_MESSAGE = gql`
  mutation CreateCourseMessage($body: String!, $course_id: String!) {
    createCourseMessage(body: $body, course_id: $course_id) {
      id
    }
  }
`;
export const COURSE_SEARCH = gql`
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
export const COURSE_QUERY = gql`
  query($id: ID!) {
    course(where: { id: $id }) {
      name
      description
      id
    }
  }
`;

export const COURSE_DESC_MUTATION = gql`
  mutation($desc: String!, $id: String!) {
    updateCourseDescription(course_id: $id, description: $desc) {
      name
      description
      id
    }
  }
`;
export const COURSE_INFO = gql`
  query Course($courseId: ID!) {
    course(where: { id: $courseId }) {
      id
      name
      title
      description
      term
      users {
        id
        name
      }
    }
  }
`;

export interface ICourse {
  id: string;
  name: string;
}

export class CourseQueryComp extends Query {}
export class CourseMutationComp extends Mutation {}
