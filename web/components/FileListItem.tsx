import React from "react";
import {
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  Tooltip,
  createStyles,
  withStyles,
} from "@material-ui/core";
import {
  Image,
  FeaturedVideo,
  Audiotrack,
  Attachment,
  Book,
  Archive,
} from "@material-ui/icons";
import gql from "graphql-tag";

import ContentViewer from "./ContentViewer";
import BigTextEdit from "./BigTextEdit";
import {
  EDIT_FILE_METADATA,
  UpdateCourseFileMetaMute,
} from "../queries/courseContentQueries";

const getIcon = (fileType: string) => {
  switch (fileType) {
    case "audio/mpeg":
      return Audiotrack;
    case "video/mp4":
      return FeaturedVideo;
    case "image/png":
      return Image;
    case "image/jpeg":
      return Image;
    case "image/svg":
      return Image;
    case "image/svg+xml":
      return Image;
    case "application/pdf":
      return Book;
    case "application/zip":
      return Archive;
    default:
      return Attachment;
  }
};

const styles = createStyles(theme => ({
  ListItem: { marginBottom: theme.spacing.unit, width: "100%" },
  outerListItem: { margin: theme.spacing.unit * 0.5 },
}));

interface IProps {
  id: string;
  name: string;
  type: string;
  creatorId: string;
  url: string;
  description: string;
  allow_edits?: boolean;
  classes: {
    ListItem: string;
    outerListItem: string;
  };
}

interface IState {
  filePreviewOpen: boolean;
}

class FileListItem extends React.Component<IProps, IState> {
  static defaultProps = {
    allow_edits: false,
  };

  state = {
    filePreviewOpen: false,
  };

  render() {
    const Icon = getIcon(this.props.type);
    const titleComponent = this.props.allow_edits ? (
      <UpdateCourseFileMetaMute
        mutation={EDIT_FILE_METADATA}
        /*
      Note: this is a good example of how to easily update single nodes in the
      ApolloGraphQL cache after you mutate them.
      */
        update={(proxy, result) => {
          if (result.errors) {
            console.warn(result.errors);
            return;
          }
          const { id, name } = result.data.updateContentMetadata;
          proxy.writeFragment({
            id,
            fragment: gql`
              fragment FileName on ContentPiece {
                name
              }
            `,
            data: { name, __typename: "ContentPiece" }, // The typename from `datamodel.prisma` is required here
          });
        }}
      >
        {(doMutation, { error, loading }) => {
          let disableEdit = loading;
          // We can't let users try to edit metadata while another edit request is being sent or has failed
          // or else edits might be lost.
          if (!disableEdit && error) {
            disableEdit = true;
          }
          return (
            <BigTextEdit
              initialText={this.props.name}
              nonEditingTextFieldVariant="h6"
              onSaveCallback={newText => {
                doMutation({
                  variables: {
                    content_file_id: this.props.id,
                    name: newText,
                  },
                });
              }}
              disabled={disableEdit}
            />
          );
        }}
      </UpdateCourseFileMetaMute>
    ) : (
      <span>{this.props.name}</span>
    );

    return (
      <Paper className={this.props.classes.ListItem}>
        <Grid
          container
          className={this.props.classes.outerListItem}
          alignItems="center"
        >
          <Grid item>
            <IconButton
              onClick={() =>
                this.setState(state => ({
                  ...state,
                  filePreviewOpen: !state.filePreviewOpen,
                }))
              }
            >
              <Tooltip title="Preview File">
                <Icon />
              </Tooltip>
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="h6">{this.props.name}</Typography>
          </Grid>
        </Grid>

        <Dialog
          open={this.state.filePreviewOpen}
          onClose={() => {
            this.setState(state => ({
              ...state,
              filePreviewOpen: !state.filePreviewOpen,
            }));
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullScreen
        >
          <DialogTitle id="alert-dialog-title">{titleComponent}</DialogTitle>
          <DialogContent>
            <ContentViewer
              name={this.props.name}
              type={this.props.type}
              url={this.props.url}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState(state => ({ ...state, filePreviewOpen: false }))
              }
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

export default withStyles(styles)(FileListItem);
