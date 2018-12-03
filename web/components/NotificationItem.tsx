import React from "react";
import { distanceInWordsToNow } from "date-fns";
import {
  MenuItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const NOTE_DISMISSED_QUERY = gql`
  mutation($read_id: String!) {
    readNotification(note_read_id: $read_id) {
      id
    }
  }
`;

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
  __typename?: string;
}

interface INotificationItemProps {
  onClick?: () => void;
  big?: boolean;
  read?: boolean;
  read_id: string;
}

type Props = INotificationItemProps & INotification;

const NotificationItem: React.SFC<Props> = ({
  onClick,
  msg,
  createdAt,
  note_type,
  add_data,
  big,
  read_id,
  read,
}) => {
  const displayBig = big ? big : false;
  let action = onClick ? onClick : () => null;
  const hasBeenRead = read ? read : false;

  if (note_type === NoteType.NEW_COURSE) {
    action = () => {
      Router.pushRoute(`/courses/${add_data.id}`);
      if (onClick) {
        onClick();
      }
    };
  }

  return (
    <Mutation mutation={NOTE_DISMISSED_QUERY} variables={{ read_id }}>
      {(markAsRead, { data, loading, error }) => {
        return (
          <MenuItem
            onClick={() => {
              if (!displayBig && !hasBeenRead) {
                markAsRead();
              }
              action();
            }}
          >
            <ListItemText
              primary={msg}
              secondary={distanceInWordsToNow(new Date(createdAt))}
            />
            {displayBig && !hasBeenRead ? (
              <ListItemSecondaryAction>
                <Tooltip title="mark as read">
                  <IconButton onClick={() => markAsRead()}>
                    <Done />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            ) : (
              <span />
            )}
          </MenuItem>
        );
      }}
    </Mutation>
  );
};

export default NotificationItem;
