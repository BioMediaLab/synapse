import React from "react";
import * as filestack from "filestack-js";
import { Client } from "filestack-js/build/main/lib/client";
import { Button } from "@material-ui/core";
import getConfig from "next/config";
import { CloudUpload } from "@material-ui/icons";
import { withStyles, createStyles } from "@material-ui/core/styles";

const appConfig = getConfig();

const styles = theme =>
  createStyles({
    uploadIcon: {
      marginRight: theme.spacing.unit,
    },
  });

import {
  PickerInstance,
  PickerResponse,
} from "filestack-js/build/main/lib/picker";

interface IFileStackMaterialProps {
  onUploadComplete: (result: PickerResponse) => void;
  disabled?: boolean;
  classes: {
    uploadIcon: string;
  };
}

class FileStackMaterial extends React.Component<IFileStackMaterialProps> {
  static defaultProps = {
    disabled: false,
  };

  client?: Client;
  picker?: PickerInstance;

  componentDidMount() {
    this.client = filestack.init(
      appConfig.publicRuntimeConfig.FILESTACK_API_KEY,
    );
    this.picker = this.client.picker({
      fromSources: [
        "local_file_system",
        "url",
        "googledrive",
        "dropbox",
        "box",
        "onedrive",
        "github",
      ],
      onUploadDone: this.props.onUploadComplete,
    });
  }

  render() {
    const onClick = () => {
      if (!this.client) {
        throw new Error("FilestackMaterial component not mounted");
      }
      if (this.props.disabled) {
        throw new Error("component action disabled");
      }
      this.picker.open();
    };
    return (
      <Button variant="contained" onClick={onClick}>
        <CloudUpload className={this.props.classes.uploadIcon} />
        Upload Files
      </Button>
    );
  }
}

export default withStyles(styles)(FileStackMaterial);
