import React from "react";
import { graphql, DataValue } from "react-apollo";
import { withSnackbar, InjectedNotistackProps } from "notistack";
import gql from "graphql-tag";
import { compareDesc } from "date-fns";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";

import NotificationItem, { INotification } from "./NotificationItem";

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription {
    notification {
      id
      msg
      add_data
      note_type
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
        note_type
        createdAt
      }
    }
  }
`;

interface IRecentNotifications {
  recentNotifications: {
    __typename: string;
    total: number;
    notes: INotification[];
  };
}

interface ITNProps {
  data: DataValue<IRecentNotifications, {}>;
  subscribeToUpdates: (updateCb: (note: INotification) => void) => void;
}

type ITNPropsFull = ITNProps & InjectedNotistackProps;

interface ITNState {
  menuOpen: boolean;
}

interface Notifications {
  anchorEl: any;
}

class Notifications extends React.Component<ITNPropsFull, ITNState> {
  constructor(props) {
    super(props);

    this.anchorEl = null;
    this.state = {
      menuOpen: false,
    };
  }

  componentDidMount() {
    this.props.subscribeToUpdates(note => {
      this.props.enqueueSnackbar(note.msg);
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
    const unreadNotes =
      this.props.data.loading || this.props.data.error
        ? 0
        : this.props.data.recentNotifications.total;

    const notes = (this.props.data.loading
      ? []
      : this.props.data.recentNotifications.notes
    ).sort((note1, note2) =>
      compareDesc(new Date(note1.createdAt), new Date(note2.createdAt)),
    );

    return (
      <React.Fragment>
        <IconButton
          id="notification_menu_icon_button"
          color="inherit"
          onClick={this.showMenu}
        >
          {unreadNotes !== 0 ? (
            <Badge badgeContent={unreadNotes} color="secondary">
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
          {notes.map(note => (
            <NotificationItem key={note.id} onClick={this.hideMenu} {...note} />
          ))}
          {notes.length === 0 ? (
            <span>No Notifications at this time</span>
          ) : (
            <span />
          )}
        </Menu>
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  graphql<InjectedNotistackProps, IRecentNotifications, {}>(
    GET_RECENT_NOTIFICATIONS,
    {
      props: ({ data, ownProps }) => ({
        data,
        subscribeToUpdates: updateCb => {
          data.subscribeToMore({
            document: NOTIFICATION_SUBSCRIPTION,
            updateQuery: (
              prevData: DataValue<IRecentNotifications, {}>,
              { subscriptionData },
            ) => {
              const newNote: INotification = subscriptionData.data.notification;
              updateCb(newNote);
              return {
                ...prevData,
                recentNotifications: {
                  ...prevData.recentNotifications,
                  total: prevData.recentNotifications.total + 1,
                  notes: [...prevData.recentNotifications.notes, newNote],
                },
              };
            },
          });
        },
        ...ownProps,
      }),
    },
  )(Notifications),
);
