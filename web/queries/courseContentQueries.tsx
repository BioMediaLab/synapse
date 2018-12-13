import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

interface IGetCourseFilesVars {
  course_id: string;
}

interface IGetCourseFilesResult {
  course: {
    __typename: string;
    id: string;
    files: Array<{
      id: string;
      name: string;
      description: string;
      url: string;
      type: string;
      updatedAt: string;
      creator: {
        id: string;
        name: string;
      };
    }>;
  };
}

export const GET_COURSE_FILES = gql`
  query($course_id: ID!) {
    course(where: { id: $course_id }) {
      id
      files {
        id
        name
        description
        url
        type
        updatedAt
        creator {
          id
          name
        }
      }
    }
  }
`;

export class CourseFileQuery extends Query<
  IGetCourseFilesResult,
  IGetCourseFilesVars
> {}

interface IContentCreationVars {
  course_id: string;
  name: string;
  url: string;
  type: string;
  desc?: string;
}

export const CREATE_COURSE_FILE = gql`
  mutation(
    $course_id: String!
    $name: String!
    $url: String!
    $type: String!
    $desc: String
  ) {
    createContent(
      name: $name
      type: $type
      url: $url
      course_id: $course_id
      description: $desc
    ) {
      id
    }
  }
`;

export class CreateCourseFileMutation extends Mutation<
  { id: string },
  IContentCreationVars
> {}
