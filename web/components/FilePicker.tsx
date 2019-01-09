import React from "react";
import {
  Paper,
  withStyles,
  createStyles,
  Theme,
  Grid,
  TextField,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import Fuse from "fuse.js";

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
      margin: theme.spacing.unit * 0.2,
      marginBottom: theme.spacing.unit * 0.5,
      display: "flex",
      justifyContent: "space-between",
    },
    fileList: {
      marginTop: theme.spacing.unit,
      minHeight: theme.spacing.unit * 5,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
    },
    pageTitle: {
      marginBottom: theme.spacing.unit,
    },
    uploadButton: {
      margin: theme.spacing.unit,
    },
  });

interface IFilePickerProps {
  courseId: string;
  classes: {
    topFilterBar: string;
    fileList: string;
    pageTitle: string;
    uploadButton: string;
  };
}

interface IFilePickerState {
  filteringFiles: boolean;
  curFileFilterText: string;
}

class FilePicker extends React.Component<IFilePickerProps, IFilePickerState> {
  state = {
    curFileFilterText: "",
    filteringFiles: false,
  };

  onFilterFieldChange = event => {
    const value: string = event.target.value;
    let filteringFiles = true;
    if (value === "") {
      filteringFiles = false;
    }
    this.setState(state => ({
      ...state,
      curFileFilterText: value,
      filteringFiles,
    }));
  };

  render() {
    const { classes, courseId } = this.props;

    return (
      <>
        <Typography variant="h5" className={classes.pageTitle}>
          Files
        </Typography>

        <div className={classes.topFilterBar}>
          <TextField
            label="Filter for files"
            value={this.state.curFileFilterText}
            onChange={this.onFilterFieldChange}
            className={classes.topFilterBar}
          />
          <div className={classes.uploadButton}>
            <CreateCourseFileMutation
              mutation={CREATE_COURSE_FILE}
              refetchQueries={[
                {
                  query: GET_COURSE_FILES,
                  variables: { course_id: courseId },
                },
              ]}
            >
              {(doMutation, mutationResult) => {
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
                              course_id: courseId,
                              url: file.url,
                              type: file.mimetype,
                            },
                          });
                          if (uploadResult && uploadResult.errors) {
                            throw new Error(
                              `Uploading ${file.filename} failed`,
                            );
                          }
                        });
                    }}
                    disabled={mutationResult.loading}
                  />
                );
              }}
            </CreateCourseFileMutation>
          </div>
        </div>
        <Paper>
          <Grid container direction="column">
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

                  let files = data.course.files;
                  if (this.state.filteringFiles) {
                    const sorter = new Fuse(files, {
                      keys: ["name", "description"],
                    });
                    files = sorter.search(this.state.curFileFilterText);
                  }

                  return (
                    <div className={classes.fileList}>
                      {files
                        .sort(({ name: name1 }, { name: name2 }) => {
                          if (
                            name1.toLocaleLowerCase() <
                            name2.toLocaleLowerCase()
                          ) {
                            return -1;
                          }
                          return 1;
                        })
                        .map(file => (
                          <FileListItem
                            id={file.id}
                            name={file.name}
                            description={file.description}
                            creatorId={file.creator.id}
                            type={file.type}
                            url={file.url}
                            key={file.id}
                            allow_edits
                          />
                        ))}
                    </div>
                  );
                }}
              </CourseFileQuery>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(FilePicker);
