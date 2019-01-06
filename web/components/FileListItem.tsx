import React from "react";
import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  Tooltip,
} from "@material-ui/core";
import {
  Image,
  FeaturedVideo,
  Audiotrack,
  Attachment,
  Book,
  Archive,
} from "@material-ui/icons";

import ContentViewer from "./ContentViewer";

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
    case "application/pdf":
      return Book;
    case "application/zip":
      return Archive;
    default:
      return Attachment;
  }
};

interface IProps {
  name: string;
  type: string;
  creatorId: string;
  url: string;
  description: string;
}

interface IState {
  filePreviewOpen: boolean;
}

class FileListItem extends React.Component<IProps, IState> {
  state = {
    filePreviewOpen: false,
  };

  render() {
    const Icon = getIcon(this.props.type);
    return (
      <>
        <Grid container alignItems="center">
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
          <DialogTitle id="alert-dialog-title">
            {this.props.name} (Preview)
          </DialogTitle>
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
      </>
    );
  }
}

export default FileListItem;
