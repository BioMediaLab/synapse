import React, { ReactNode } from "react";
import {
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
} from "@material-ui/core";

interface IProps {
  showing: boolean;
  yes: () => void;
  no: () => void;
  optionYesText?: string;
  optionNoText?: string;
  title?: string;
  children?: ReactNode;
}

const AreYouSure: React.SFC<IProps> = props => {
  const child = props.children ? props.children : <span>Are you sure?</span>;
  const title = props.title ? props.title : "Confirm?";
  const yesText = props.optionYesText ? props.optionYesText : "Yes";
  const noText = props.optionYesText ? props.optionNoText : "No";
  return (
    <Dialog open={props.showing}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{child}</DialogContent>
      <DialogActions>
        <Button onClick={() => props.yes()}>{yesText}</Button>
        <Button onClick={() => props.no()}>{noText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AreYouSure;
