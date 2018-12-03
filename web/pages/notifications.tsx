import React from "react";
import withAuth from "../lib/withAuth";
import {
  Typography,
  Grid,
  Paper,
  LinearProgress,
  Button,
  withStyles,
  createStyles,
  List,
  Divider,
} from "@material-ui/core";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import ErrorMessage from "../components/ErrorMessage";
import Reminders from "../components/Reminders";
import NotificationItem, {
  INotification,
} from "../components/NotificationItem";

const RECENT_NOTES_QUERY = gql`
  query($read: Boolean!) {
    recentNotifications(read: $read) {
      notificationRecords {
        notification {
          id
          notify_type
          msg
          createdAt
        }
        read
        readRecordId
      }
    }
  }
`;

interface IData {
  recentNotifications: {
    notificationRecords: Array<{
      notification: INotification;
      read: boolean;
      readRecordId: string;
    }>;
  };
}

interface IVars {
  read: boolean;
}

class RecentNotesQuery extends Query<IData, IVars> {}

const DISMISS_ALL_NOTES = gql`
  mutation {
    readAllNotifications {
      id
      read
    }
  }
`;

const styles = theme => createStyles({});

const Notifications = () => (
  <div>
    <Grid container justify="space-between" spacing={8}>
      <Grid item xs={6}>
        <Grid container justify="space-between">
          <Typography variant="h4">Notifications</Typography>
          <Mutation mutation={DISMISS_ALL_NOTES}>
            {mutate => {
              return (
                <Button
                  color="secondary"
                  onClick={() => {
                    mutate();
                  }}
                >
                  Mark all as read
                </Button>
              );
            }}
          </Mutation>
        </Grid>
        <RecentNotesQuery
          query={RECENT_NOTES_QUERY}
          variables={{ read: false }}
        >
          {({ data, error, loading }) => {
            if (loading) {
              return <LinearProgress />;
            }
            if (error) {
              return <ErrorMessage message={error.message} />;
            }
            return (
              <List>
                {data.recentNotifications.notificationRecords.map(
                  ({ notification, readRecordId }) => (
                    <NotificationItem
                      key={notification.id}
                      createdAt={notification.createdAt}
                      msg={notification.msg}
                      note_type={notification.note_type}
                      id={notification.id}
                      add_data={notification.add_data}
                      read_id={readRecordId}
                      big
                    />
                  ),
                )}
              </List>
            );
          }}
        </RecentNotesQuery>
        <Divider />
        <RecentNotesQuery query={RECENT_NOTES_QUERY} variables={{ read: true }}>
          {({ data, error, loading }) => {
            if (loading) {
              return <div />;
            }
            if (error) {
              return (
                <ErrorMessage message={error ? error.message : "failed"} />
              );
            }
            return (
              <List>
                {data.recentNotifications.notificationRecords.map(
                  ({ notification, readRecordId }) => (
                    <NotificationItem
                      key={notification.id}
                      createdAt={notification.createdAt}
                      msg={notification.msg}
                      note_type={notification.note_type}
                      id={notification.id}
                      add_data={notification.add_data}
                      read_id={readRecordId}
                      big
                      read
                    />
                  ),
                )}
              </List>
            );
          }}
        </RecentNotesQuery>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Typography variant="h6">Reminders</Typography>
          <Reminders />
        </Paper>
      </Grid>
    </Grid>
  </div>
);

export default withAuth(withStyles(styles)(Notifications));
