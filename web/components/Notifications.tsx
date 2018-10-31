import React from "react";
import { Subscription, Query } from "react-apollo";
import { withSnackbar, OptionsObject } from "notistack";
import gql from "graphql-tag";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription {
    notification {
      msg
      id
      add_data
      createdAt
    }
  }
`;

const GET_RECENT_NOTIFICATIONS = gql`
  query {
    recentNotifications {
      total
      notes {
        id
        msg
        add_data
        createdAt
      }
    }
  }
`;

interface INotificationProps {
  enqueueSnackbar: (message: string, options?: OptionsObject) => any;
  onPresentSnackbar: any;
}

interface INotification {
  id: string;
  msg: string;
  add_data: object;
  creation: string;
}

interface INotificationsState {
  notes: INotification[];
  showingMenu: boolean;
}

const getNewNotes = (
  newNotes: INotification[],
  oldNotes: INotification[],
): INotification[] =>
  newNotes.filter(
    ({ id }) => oldNotes.findIndex(({ id: id2 }) => id === id2) === -1,
  );

class Notifications extends React.Component<
  INotificationProps,
  INotificationsState
> {
  state = {
    notes: [],
    showingMenu: false,
  };

  newNotes = (notes: INotification[]) => {
    const addNotes = getNewNotes(notes, this.state.notes);
    if (addNotes.length > 0) {
      this.setState(
        state => ({ ...state, notes: [...this.state.notes, ...addNotes] }),
        () => {
          if (this.state.showingMenu) {
            return;
          }
          if (addNotes.length < 4) {
            addNotes.forEach(note => this.props.enqueueSnackbar(note.msg));
            return;
          }
          this.props.enqueueSnackbar(
            `You have ${
              addNotes.length > 9 ? "10+" : addNotes.length
            } new notifications.`,
          );
        },
      );
    }
  };

  render() {
    return (
      <div>
        <Query
          query={GET_RECENT_NOTIFICATIONS}
          onCompleted={data => this.newNotes(data.recentNotifications.notes)}
        >
          {({ loading, error, data }) => {
            let unreadNotes = 0;
            if (!loading && !error && data.recentNotifications) {
              unreadNotes = data.recentNotifications.total;
            }
            return (
              <IconButton color="inherit">
                {unreadNotes !== 0 ? (
                  <Badge badgeContent={unreadNotes} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                ) : (
                  <NotificationsIcon />
                )}
              </IconButton>
            );
          }}
        </Query>
        <Subscription
          subscription={NOTIFICATION_SUBSCRIPTION}
          onSubscriptionData={({ subscriptionData }) => {
            this.newNotes([subscriptionData.data.notification]);
          }}
        />
      </div>
    );
  }
}

export default withSnackbar(Notifications);
