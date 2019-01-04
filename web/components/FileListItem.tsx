import React from "react";
import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from "@material-ui/core";
import { CallToActionSharp as ViewIcon } from "@material-ui/icons";

import ContentViewer from "./ContentViewer";

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
    return (
      <>
        <Grid container>
          <Grid item>{this.props.name}</Grid>
          <Grid item>
            <IconButton
              onClick={() =>
                this.setState(state => ({
                  ...state,
                  filePreviewOpen: !state.filePreviewOpen,
                }))
              }
            >
              <ViewIcon />
            </IconButton>
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
