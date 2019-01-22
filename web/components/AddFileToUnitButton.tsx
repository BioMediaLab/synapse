import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import FileStackMaterial from "./FileStackMaterial";

const ADD_FILE_TO_UNIT = gql`
  mutation(
    $course_id: String!
    $unit_id: String!
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
      unit_id: $unit_id
      description: $desc
    ) {
      id
    }
  }
`;

interface IFileUploadButtonProps {
  courseId: string;
  unitId: string;
}

class AddFileToUnitButton extends React.Component<IFileUploadButtonProps> {
  render() {
    console.log("unitId", this.props.unitId);
    return (
      <Mutation mutation={ADD_FILE_TO_UNIT}>
        {(doMutation, result) => {
          return (
            <FileStackMaterial
              onUploadComplete={result => {
                if (result.filesFailed && result.filesFailed.length > 0) {
                  console.warn(result.filesFailed);
                  throw new Error("file failed to upload");
                }

                result.filesUploaded
                  .filter(file => {
                    if (file.filename && file.url && file.mimetype) {
                      return true;
                    }
                    throw new Error("file property missing");
                  })
                  .forEach(async file => {
                    const uploadResult = await doMutation({
                      variables: {
                        name: file.filename,
                        course_id: this.props.courseId,
                        unit_id: this.props.unitId,
                        url: file.url,
                        type: file.mimetype,
                      },
                    });
                    if (uploadResult && uploadResult.errors) {
                      throw new Error(`Uploading ${file.filename} failed`);
                    }
                  });
              }}
              disabled={result.loading}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default AddFileToUnitButton;
