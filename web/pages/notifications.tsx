import React from "react";
import withAuth from "../lib/withAuth";
import {
  Typography,
  Grid,
  LinearProgress,
  Button,
  withStyles,
  createStyles,
  List,
  Divider,
  Tab,
  Tabs,
} from "@material-ui/core";
import { Mutation } from "react-apollo";

import ErrorMessage from "../components/ErrorMessage";
import NotificationItem from "../components/NotificationItem";
import {
  RECENT_NOTIFICATIONS_QUERY,
  READ_ALL_NOTIFICATIONS_MUTE,
  RecentNotesQueryComp,
  IRecentNotificationsResult,
} from "../queries/notificationQueries";

const styles = theme =>
  createStyles({
    notificationsList: {
      maxWidth: "80%",
    },
    tabBox: {
      paddingBottom: theme.spacing.unit * 2,
    },
  });

interface IProps {
  classes: {
    notificationsList: string;
    tabBox: string;
  };
}

interface IState {
  curTab: number;
}

class Notifications extends React.Component<IProps, IState> {
  state = {
    curTab: 0,
  };
  handleTabChange = (_, value) => {
    this.setState(state => ({ ...state, curTab: value }));
  };

  render() {
    const newNotesTab = (
      <>
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
                <List className={this.props.classes.notificationsList}>
                  {data.recentNotifications.notificationRecords.map(
                    ({ notification, readRecordId }) => (
                      <NotificationItem
                        key={notification.id}
                        createdAt={notification.createdAt}
                        msg={notification.msg}
                        notify_type={notification.notify_type}
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
      </>
    );
    const allNotesTab = (
      <>
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
                <List className={this.props.classes.notificationsList}>
                  {data.recentNotifications.notificationRecords.map(
                    ({ notification, readRecordId }) => (
                      <NotificationItem
                        key={notification.id}
                        createdAt={notification.createdAt}
                        msg={notification.msg}
                        notify_type={notification.notify_type}
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
                <List className={this.props.classes.notificationsList}>
                  {data.recentNotifications.notificationRecords.map(
                    ({ notification, readRecordId }) => (
                      <NotificationItem
                        key={notification.id}
                        createdAt={notification.createdAt}
                        msg={notification.msg}
                        notify_type={notification.notify_type}
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
      </>
    );

    return (
      <main>
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
              try {
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
                      ...cacheForOldNotes.recentNotifications
                        .notificationRecords,
                      ...notes,
                    ],
                  },
                };
                apolloCache.writeQuery({
                  query: RECENT_NOTIFICATIONS_QUERY,
                  variables: { read: true },
                  data: updatedCacheForOldNotes,
                });
              } catch (err) {
                console.warn(err);
              }
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
        <Tabs
          className={this.props.classes.tabBox}
          value={this.state.curTab}
          onChange={this.handleTabChange}
        >
          <Tab label="New Notifications" />
          <Tab label="All Notifications" />
        </Tabs>
        {this.state.curTab === 0 && newNotesTab}
        {this.state.curTab === 1 && allNotesTab}
      </main>
    );
  }
}

export default withAuth(withStyles(styles)(Notifications));
