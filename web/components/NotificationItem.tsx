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
import { Mutation } from "react-apollo";

import { Router } from "../Router";
import {
  READ_NOTIFICATION_MUTATION,
  RECENT_NOTIFICATIONS_QUERY,
  IRecentNotificationsResult,
  INotification,
} from "../queries/notificationQueries";
import { NoteType } from "../lib/notifications";

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
  notify_type,
  add_data,
  big,
  read_id,
  read,
}) => {
  const displayBig = big ? big : false;
  let action = onClick ? onClick : () => null;
  const hasBeenRead = read ? read : false;

  if (notify_type === NoteType.NEW_COURSE) {
    action = () => {
      Router.pushRoute(`/courses/${add_data.id}`);
      if (onClick) {
        onClick();
      }
    };
  }
  if (notify_type === NoteType.COURSE_MESSAGE) {
    action = () => {
      Router.pushRoute(`/courses/${add_data.course_id}`);
      if (onClick) {
        onClick();
      }
    };
  }

  return (
    <Mutation
      mutation={READ_NOTIFICATION_MUTATION}
      variables={{ read_id }}
      update={apolloClientCache => {
        const cachedUnreadNotes: IRecentNotificationsResult = apolloClientCache.readQuery(
          {
            query: RECENT_NOTIFICATIONS_QUERY,
            variables: { read: false },
          },
        );
        const updatedNewCache: IRecentNotificationsResult = {
          ...cachedUnreadNotes,
          recentNotifications: {
            ...cachedUnreadNotes.recentNotifications,
            total: cachedUnreadNotes.recentNotifications.total - 1,
            notificationRecords: cachedUnreadNotes.recentNotifications.notificationRecords.filter(
              record => record.readRecordId !== read_id,
            ),
          },
        };
        apolloClientCache.writeQuery({
          query: RECENT_NOTIFICATIONS_QUERY,
          variables: { read: false },
          data: updatedNewCache,
        });

        // TODO: this may be buggy
        try {
          const cachedOldNotes: IRecentNotificationsResult = apolloClientCache.readQuery(
            {
              query: RECENT_NOTIFICATIONS_QUERY,
              variables: { read: true },
            },
          );
          const updatedOldCache = {
            ...cachedOldNotes,
            recentNotifications: {
              ...cachedOldNotes.recentNotifications,
              notificationRecords: [
                ...cachedOldNotes.recentNotifications.notificationRecords,
                ...cachedUnreadNotes.recentNotifications.notificationRecords.filter(
                  record => record.readRecordId === read_id,
                ),
              ],
            },
          };

          apolloClientCache.writeQuery({
            query: RECENT_NOTIFICATIONS_QUERY,
            variables: { read: true },
            data: updatedOldCache,
          });
        } catch (err) {
          // probably the query was not found
          console.warn(err);
          return;
        }
      }}
    >
      {markAsRead => {
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
              secondary={`${distanceInWordsToNow(new Date(createdAt))} ago`}
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
