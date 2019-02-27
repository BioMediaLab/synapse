import React from "react";
import {
  withStyles,
  createStyles,
  Theme,
  TextField,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
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
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const styles = (theme: Theme) =>
  createStyles({
    filesPage: {
      margin: "auto",
      maxWidth: 1080,
    },
    header: {
      marginBottom: theme.spacing.unit * 0.5,
      display: "flex",
      justifyContent: "space-between",
    },
    topFilterBar: {
      position: "relative",
      display: "inline-block",
    },
    fileList: {
      marginTop: theme.spacing.unit,
      minHeight: theme.spacing.unit * 5,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
    },
    pageTitle: {
      marginBottom: theme.spacing.unit,
    },
    searchIcon: {
      position: "absolute",
      left: 0,
      top: 20,
    },
    filterInput: {
      paddingLeft: 30,
    },
  });

interface IFilePickerProps {
  courseId: string;
  classes: {
    filesPage: string;
    header: string;
    topFilterBar: string;
    fileList: string;
    pageTitle: string;
    searchIcon: string;
    filterInput: string;
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
    units: {
      1: {
        contentIds: ["cjqqp8gbp00yg0a06b9wg1fsf", "cjr15tn0q00jq0906segh8zli"],
      },
    },
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

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    // check to see if location changed. if not return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const unit = this.state.units[source.droppableId];
    const newContentIds = Array.from(unit.contentIds);
    // remove
    newContentIds.splice(source.index, 1);
    // insert
    newContentIds.splice(destination.index, 0, draggableId);

    const newUnit = {
      ...unit,
      contentIds: newContentIds,
    };

    const newState = {
      ...this.state,
      units: {
        ...this.state.units,
        [newUnit.id]: newUnit,
      },
    };

    this.setState(newState);
  };

  render() {
    const { classes, courseId } = this.props;

    console.warn(this.state);

    return (
      <div className={classes.filesPage}>
        <Typography variant="h5" className={classes.pageTitle}>
          Files
        </Typography>

        <div className={classes.header}>
          <div className={classes.topFilterBar}>
            <Search className={classes.searchIcon} />
            <TextField
              label="Filter for files"
              value={this.state.curFileFilterText}
              onChange={this.onFilterFieldChange}
              style={{ textIndent: 30 }}
              InputProps={{ className: classes.filterInput }}
            />
          </div>

          <div>
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

            let items = data.course.files;
            if (this.state.filteringFiles) {
              const sorter = new Fuse(items, {
                keys: ["name", "description"],
              });
              items = sorter.search(this.state.curFileFilterText);
            }

            return (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.fileList}>
                  <Droppable droppableId="1">
                    {provided => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items.map((file, index) => (
                          <FileListItem
                            id={file.id}
                            name={file.name}
                            description={file.description}
                            creatorId={file.creator.id}
                            type={file.type}
                            url={file.url}
                            key={file.id}
                            allow_edits
                            index={index}
                          />
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            );
          }}
        </CourseFileQuery>
      </div>
    );
  }
}

export default withStyles(styles)(FilePicker);
