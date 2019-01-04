import React from "react";
import {
  Paper,
  withStyles,
  createStyles,
  Theme,
  Grid,
  TextField,
  LinearProgress,
} from "@material-ui/core";

import {
  CREATE_COURSE_FILE,
  GET_COURSE_FILES,
  CourseFileQuery,
  CreateCourseFileMutation,
} from "../queries/courseContentQueries";
import FileStackMaterial from "./FileStackMaterial";
import FileListItem from "./FileListItem";
import ErrorMessage from "./ErrorMessage";

const styles = (theme: Theme) =>
  createStyles({
    topFilterBar: {
      padding: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 0.5,
    },
    fileList: {
      marginTop: theme.spacing.unit,
      minHeight: theme.spacing.unit * 5,
    },
  });

interface IFilePickerProps {
  courseId: string;
  classes: {
    topFilterBar: string;
    fileList: string;
  };
}

const FilePicker: React.SFC<IFilePickerProps> = ({ courseId, classes }) => (
  <Paper>
    <Grid container direction="column">
      <Grid item>
        <Paper className={classes.topFilterBar}>
          <Grid container spacing={16}>
            <Grid item>
              <CreateCourseFileMutation mutation={CREATE_COURSE_FILE}>
                {(doMutation, mutationResult) => {
                  return (
                    <FileStackMaterial
                      onUploadComplete={result => {
                        result.filesUploaded.forEach(file => {
                          if (file.filename && file.url && file.mimetype) {
                            doMutation({
                              variables: {
                                name: file.filename,
                                course_id: courseId,
                                url: file.url,
                                type: file.mimetype,
                              },
                            });
                          } else {
                            throw new Error("file property missing");
                          }
                        });
                        if (
                          result.filesFailed &&
                          result.filesFailed.length > 0
                        ) {
                          console.warn(result.filesFailed);
                          throw new Error("file failed to upload");
                        }
                      }}
                      disabled={mutationResult.loading}
                    />
                  );
                }}
              </CreateCourseFileMutation>
            </Grid>
            <Grid item>
              <TextField label="Filter for files" />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <CourseFileQuery
          query={GET_COURSE_FILES}
          variables={{ course_id: courseId }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <LinearProgress />;
            }
            if (error) {
              return <ErrorMessage message={error.message} />;
            }
            return (
              <div className={classes.fileList}>
                {data.course.files.map(file => (
                  <FileListItem
                    name={file.name}
                    description={file.description}
                    creatorId={file.creator.id}
                    type={file.type}
                    url={file.url}
                  />
                ))}
              </div>
            );
          }}
        </CourseFileQuery>
      </Grid>
    </Grid>
  </Paper>
);

export default withStyles(styles)(FilePicker);
