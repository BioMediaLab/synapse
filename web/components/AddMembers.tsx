import React, { FunctionComponent, useState, ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { withSnackbar, InjectedNotistackProps, VariantType } from "notistack";

import { IUser } from "../queries/userQueries";
import UserSearch from "./UserSearch";

interface IMutationState {
  success: boolean;
  message?: string;
}

interface IProps {
  buttonText?: string;
  titleText?: string;
  children?: ReactNode;
  onComplete: (users: IUser[]) => Promise<IMutationState | null>;
}

type Props = IProps & InjectedNotistackProps;

const AddMembers: FunctionComponent<Props> = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, updateUsers] = useState<IUser[]>([]);

  const buttonText = props.buttonText ? props.buttonText : "Add Members";
  const titleText = props.titleText ? props.titleText : "Add Members";
  const child = props.children ? props.children : <span />;

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{buttonText}</Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{titleText}</DialogTitle>
        <DialogContent>
          <UserSearch onValueChange={users => updateUsers(users)} />
          {child}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              setIsOpen(false);
              const users = selectedUsers;
              updateUsers([]);
              const complete = await props.onComplete(users);
              if (complete) {
                const opts = {
                  variant: (complete.success
                    ? "success"
                    : "fail") as VariantType,
                };
                if (complete.message) {
                  props.enqueueSnackbar(complete.message, opts);
                } else {
                  props.enqueueSnackbar(
                    complete.success ? "Success" : "Fail",
                    opts,
                  );
                }
              }
            }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              updateUsers([]);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withSnackbar(AddMembers);
