import React from "react";
import { graphql, DataValue, withApollo, WithApolloClient } from "react-apollo";
import { withSnackbar, InjectedNotistackProps } from "notistack";
import { compareDesc } from "date-fns";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { Badge, IconButton, Menu, MenuItem } from "@material-ui/core";

import NotificationItem from "./NotificationItem";
import { Link } from "../Router";
import { whenNotificationRecieved } from "../lib/notifications";
import {
  INotification,
  IRecentNotificationsResult,
  IRecentNotificationsVariables,
  RECENT_NOTIFICATIONS_QUERY,
  NEW_NOTIFICATION_SUBSCRIPTION,
} from "../queries/notificationQueries";

interface ITNProps {
  data: DataValue<IRecentNotificationsResult, IRecentNotificationsVariables>;
  subscribeToUpdates: (
    updateCb: (newNotification: INotification) => void,
  ) => void;
}

type ITNPropsFull = WithApolloClient<ITNProps & InjectedNotistackProps>;

interface ITNState {
  menuOpen: boolean;
}

class Notifications extends React.Component<ITNPropsFull, ITNState> {
  anchorEl: any;
  constructor(props) {
    super(props);

    this.anchorEl = null;
    this.state = {
      menuOpen: false,
    };
  }

  componentDidMount() {
    this.props.subscribeToUpdates(notification => {
      // when we recieve a new notification, show the snackbar with it's message
      if (notification.msg) {
        this.props.enqueueSnackbar(notification.msg);
      }
    });

    this.anchorEl = document.getElementById("notification_menu_icon_button");
  }

  showMenu = () => {
    this.setState(state => ({ ...state, menuOpen: true }));
  };

  hideMenu = () => {
    this.setState(state => ({ ...state, menuOpen: false }));
  };

  render() {
    const totalUnreadNotifications =
      this.props.data.loading || this.props.data.error
        ? 0
        : this.props.data.recentNotifications.total;

    const unreadNotifications = (this.props.data.loading ||
    this.props.data.error
      ? []
      : this.props.data.recentNotifications.notificationRecords.map(record => ({
          ...record.notification,
          read_id: record.readRecordId,
        }))
    ).sort((note1, note2) =>
      compareDesc(new Date(note1.createdAt), new Date(note2.createdAt)),
    );

    return (
      <>
        <IconButton
          id="notification_menu_icon_button"
          color="inherit"
          onClick={this.showMenu}
        >
          {totalUnreadNotifications !== 0 ? (
            <Badge badgeContent={totalUnreadNotifications} color="secondary">
              <NotificationsIcon />
            </Badge>
          ) : (
            <NotificationsIcon />
          )}
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={this.anchorEl}
          open={this.state.menuOpen}
          onClose={this.hideMenu}
        >
          {unreadNotifications.map(note => (
            <NotificationItem key={note.id} onClick={this.hideMenu} {...note} />
          ))}
          {unreadNotifications.length === 0 ? (
            <span>No Notifications at this time</span>
          ) : (
            <span />
          )}
          <MenuItem onClick={this.hideMenu}>
            <Link route="/notifications">
              <a>All Notifications</a>
            </Link>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

export default withSnackbar(
  withApollo(
    graphql<
      WithApolloClient<InjectedNotistackProps>,
      IRecentNotificationsResult,
      IRecentNotificationsVariables
    >(RECENT_NOTIFICATIONS_QUERY, {
      options: { variables: { read: false } },
      props: ({ data, ownProps }) => ({
        data,
        subscribeToUpdates: updateCb => {
          // adding a new Prop to the component that starts the subscription
          data.subscribeToMore({
            document: NEW_NOTIFICATION_SUBSCRIPTION, // the graphql query to run
            updateQuery: (
              // a callback to fire when data is recieved via the subscription websocket
              prevData: DataValue<IRecentNotificationsResult, {}>,
              { subscriptionData: { data: subData } },
            ) => {
              if (!subData.notification) {
                return prevData;
              }
              const newNotification: INotification =
                subData.notification.notification;

              // a callback when the notification is recieved for updating cache
              whenNotificationRecieved(newNotification, ownProps.client as any);
              // callback supplied by component
              updateCb(newNotification);

              /*
              Besides the data records, there are also _typename fields on this data
              so we spread the data objects to correctly populate those fields.
            */
              return {
                ...prevData,
                recentNotifications: {
                  ...prevData.recentNotifications,
                  total: prevData.recentNotifications.total + 1,
                  notificationRecords: [
                    ...prevData.recentNotifications.notificationRecords,
                    {
                      ...subData.notification,
                    },
                  ],
                },
              };
            },
          });
        },
        ...ownProps, // props supplied to the component from a higher level
      }),
    })(Notifications),
  ),
);
