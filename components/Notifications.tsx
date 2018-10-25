import React from "react";
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';

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

class Notifications extends React.Component {
  render() {
    return (
      <div>
        <Subscription subscription={NOTIFICATION_SUBSCRIPTION}>
          {(all) => {
            console.log(all);
            return (
              <div>Datum</div>
            );
          }}
        </Subscription>
      </div>
    );
  }
}

export default Notifications;
