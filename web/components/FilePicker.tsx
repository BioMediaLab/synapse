import React from "react";
import ReactFilestack from "filestack-react";
import { Paper } from "@material-ui/core";

import {
  CREATE_COURSE_FILE,
  GET_COURSE_FILES,
  CourseFileQuery,
  CreateCourseFileMutation,
} from "../queries/courseContentQueries";

interface IFilestackFile {
  filename: string;
  handle: string;
  mimetype: string;
  originalPath: string;
  size: number;
  source: string;
  status: string;
  uploadId: string;
  url: string;
  originalFile: {
    name: string;
    size: number;
    type: string;
  };
}

interface IFilestackUpload {
  filesFailed: IFilestackFile[];
  filesUploaded: IFilestackFile[];
}

interface IFilePickerProps {
  courseId: string;
}

const FilePicker: React.SFC<IFilePickerProps> = ({ courseId }) => (
  <Paper>
    <CourseFileQuery
      query={GET_COURSE_FILES}
      variables={{ course_id: courseId }}
    >
      {({ loading, error, data }) => {
        console.log(data);
        return <div>asdf</div>;
      }}
    </CourseFileQuery>
    Files
    <CreateCourseFileMutation mutation={CREATE_COURSE_FILE}>
      {(doMutation, mutationResult) => {
        return (
          <ReactFilestack
            apikey="AzFPnNv2wSTW4x5E7LEPVz"
            buttonText="Click me"
            buttonClass="classname"
            options={{
              fromSources: [
                "local_file_system",
                "url",
                "googledrive",
                "dropbox",
                "box",
                "onedrive",
                "github",
              ],
            }}
            onSuccess={(result: IFilestackUpload) => {
              result.filesUploaded.forEach(file => {
                doMutation({
                  variables: {
                    name: file.filename,
                    course_id: courseId,
                    url: file.url,
                    type: file.mimetype,
                  },
                });
              });
              console.log(result);
            }}
            onError={console.warn}
          />
        );
      }}
    </CreateCourseFileMutation>
  </Paper>
);

export default FilePicker;
