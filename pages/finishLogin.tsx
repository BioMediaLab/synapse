import React from "react";
import Router from "../routes";
import { ApolloConsumer, WithApolloClient } from 'react-apollo';

class Fetcher extends React.Component<WithApolloClient<any>> {
  componentWillMount() {
    console.log("time to redirect");
    // Router.pushRoute("/");
  }

  render() {
    return <div />;
  }
}

export default class FinishLoginMain extends React.Component {

  render() {
    return (
      <ApolloConsumer>
        {
          client => (
            <React.Fragment>
              <Fetcher client={client} />
              <div>
                Loading...
              </div>
            </React.Fragment>
          )
        }
      </ApolloConsumer>
    );
  }
}
