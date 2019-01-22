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

export const CREATE_COURSE_UNIT = gql`
  mutation CreateCourseUnit($name: String!, $description: String!) {
    createCourseUnit(name: $name, description: $description) {
      name
      id
    }
  }
`;

export const GET_COURSE_FILES = gql`
  query($course_id: ID!) {
    course(id: $course_id) {
      id
      units {
        items {
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
  { createContent: { id: string } },
  IContentCreationVars
> {}

export const EDIT_FILE_METADATA = gql`
  mutation($content_file_id: String!, $name: String, $description: String) {
    updateContentMetadata(
      name: $name
      description: $description
      id: $content_file_id
    ) {
      id
      name
      description
    }
  }
`;

export class UpdateCourseFileMetaMute extends Mutation<
  { updateContentMetadata: { id: string; name: string; description: string } },
  { content_file_id: string; name?: string; description?: string }
> {}

export const DELETE_COURSE_FILE = gql`
  mutation($content_file_id: String!) {
    deleteCourseContent(id: $content_file_id) {
      id
    }
  }
`;

export class DeleteCourseFileMute extends Mutation<
  {
    deleteCourseFile: { id: string };
  },
  { content_file_id: string }
> {}
