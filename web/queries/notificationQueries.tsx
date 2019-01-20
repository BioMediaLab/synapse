import gql from "graphql-tag";
import { Query } from "react-apollo";
import { NoteType } from "../lib/notifications";

/*
Get's a user's notifications, read or unread.
*/
export const RECENT_NOTIFICATIONS_QUERY = gql`
  query($read: Boolean!) {
    recentNotifications(read: $read) {
      total
      notificationRecords {
        notification {
          id
          msg
          add_data
          notify_type
          createdAt
        }
        read
        readRecordId
      }
    }
  }
`;

/*
Subscribes to any new notifications that are created.
*/
export const NEW_NOTIFICATION_SUBSCRIPTION = gql`
  subscription {
    notification {
      readRecordId
      read
      notification {
        id
        msg
        add_data
        notify_type
        createdAt
      }
    }
  }
`;

/*
Updates a single notification to record that the user has seen it
*/
export const READ_NOTIFICATION_MUTATION = gql`
  mutation($read_id: String!) {
    readNotification(note_read_id: $read_id) {
      id
    }
  }
`;

/*
Updates all of a user's "unread" notifications to mark them as read.
*/
export const READ_ALL_NOTIFICATIONS_MUTE = gql`
  mutation {
    readAllNotifications {
      count
    }
  }
`;

export interface INotification {
  id: string;
  msg: string;
  add_data: any;
  createdAt: string;
  notify_type: NoteType;
  __typename?: string;
}

export interface IRecentNotificationsResult {
  recentNotifications: {
    total: number;
    notificationRecords: Array<{
      notification: INotification;
      read: boolean;
      readRecordId: string;
    }>;
  };
}

export interface IRecentNotificationsVariables {
  read: boolean;
}

export class RecentNotesQueryComp extends Query<
  IRecentNotificationsResult,
  IRecentNotificationsVariables
> {}
