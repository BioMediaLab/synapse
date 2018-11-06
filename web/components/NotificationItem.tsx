import React from "react";
import { distanceInWordsToNow } from "date-fns";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Router } from "../Router";

export enum NoteType {
  INFORMATIVE = "INFORMATIVE",
  NEW_COURSE = "NEW_COURSE",
}

export interface INotification {
  id: string;
  msg: string;
  add_data: any;
  createdAt: string;
  note_type: NoteType;
  __typename: string;
}

interface INotificationItemProps {
  onClick: () => void;
}

type Props = INotificationItemProps & INotification;

const NotificationItem: React.SFC<Props> = ({
  onClick,
  msg,
  createdAt,
  note_type,
  add_data,
}) => {
  let action = onClick;
  if (note_type === NoteType.NEW_COURSE) {
    action = () => {
      Router.pushRoute(`/courses/${add_data.id}`);
      onClick();
    };
  }

  return (
    <MenuItem onClick={action}>
      <ListItemText
        primary={msg}
        secondary={distanceInWordsToNow(new Date(createdAt))}
      />
    </MenuItem>
  );
};

export default NotificationItem;
