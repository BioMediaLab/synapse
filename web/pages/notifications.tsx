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
import { Mutation } from "react-apollo";

import ErrorMessage from "../components/ErrorMessage";
import Reminders from "../components/Reminders";
import NotificationItem from "../components/NotificationItem";
import {
  RECENT_NOTIFICATIONS_QUERY,
  READ_ALL_NOTIFICATIONS_MUTE,
  RecentNotesQueryComp,
  IRecentNotificationsResult,
} from "../queries/notificationQueries";

const styles = theme => createStyles({});

const Notifications = () => (
  <div>
    <Grid container justify="space-between" spacing={8}>
      <Grid item xs={6}>
        <Grid container justify="space-between">
          <Typography variant="h4">Notifications</Typography>
          <Mutation
            mutation={READ_ALL_NOTIFICATIONS_MUTE}
            update={apolloCache => {
              const unreadNotes: IRecentNotificationsResult = apolloCache.readQuery(
                {
                  query: RECENT_NOTIFICATIONS_QUERY,
                  variables: { read: false },
                },
              );
              const notes = unreadNotes.recentNotifications.notificationRecords;
              const updatedUnreadCache: IRecentNotificationsResult = {
                ...unreadNotes,
                recentNotifications: {
                  ...unreadNotes.recentNotifications,
                  total: 0,
                  notificationRecords: [],
                },
              };
              apolloCache.writeQuery({
                query: RECENT_NOTIFICATIONS_QUERY,
                variables: { read: false },
                data: updatedUnreadCache,
              });

              const cacheForOldNotes: IRecentNotificationsResult = apolloCache.readQuery(
                {
                  query: RECENT_NOTIFICATIONS_QUERY,
                  variables: { read: true },
                },
              );
              const updatedCacheForOldNotes: IRecentNotificationsResult = {
                ...cacheForOldNotes,
                recentNotifications: {
                  ...cacheForOldNotes.recentNotifications,
                  notificationRecords: [
                    ...cacheForOldNotes.recentNotifications.notificationRecords,
                    ...notes,
                  ],
                },
              };
              apolloCache.writeQuery({
                query: RECENT_NOTIFICATIONS_QUERY,
                variables: { read: true },
                data: updatedCacheForOldNotes,
              });
            }}
          >
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
        <RecentNotesQueryComp
          query={RECENT_NOTIFICATIONS_QUERY}
          variables={{ read: false }}
        >
          {({ data, error, loading }) => {
            if (loading) {
              return <LinearProgress />;
            }
            if (error) {
              return <ErrorMessage message={error.message} />;
            }
            const totalNotes =
              data.recentNotifications.notificationRecords.length;
            return (
              <>
                {totalNotes === 0 ? (
                  <Typography variant="body2">
                    You have no unread notifications at this time...
                  </Typography>
                ) : (
                  <Typography variant="caption">
                    Unread Notifications
                  </Typography>
                )}
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
              </>
            );
          }}
        </RecentNotesQueryComp>
        <Divider />
        <RecentNotesQueryComp
          query={RECENT_NOTIFICATIONS_QUERY}
          variables={{ read: true }}
        >
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
              <>
                <Typography variant="caption">Old Notifications</Typography>
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
              </>
            );
          }}
        </RecentNotesQueryComp>
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
