import React from "react";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  DialogContentText,
} from "@material-ui/core";

const ME_QUERY = gql`
  query {
    me {
      id
      hasVisited
    }
  }
`;

const closeDialog = (client: any, id: string) => {
  if (id.length < 5) {
    throw new Error("bad id");
  }
  const typeName = "User";
  client.writeFragment({
    id: `${typeName}:${id}`,
    fragment: gql`
      fragment Visits on User {
        hasVisited
      }
    `,
    data: { hasVisited: true, __typename: typeName },
  });
};

export default withApollo(({ client }) => (
  <Query query={ME_QUERY}>
    {({ loading, error, data }) => {
      const open = !(error || loading || (data.me && data.me.hasVisited));
      const id = data.me ? data.me.id : "";
      return (
        <Dialog open={open}>
          <DialogTitle>Welcome to Syanpse</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Check out your courses by clicking on one of the links to the
              left.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeDialog(client, id)}>Close</Button>
          </DialogActions>
        </Dialog>
      );
    }}
  </Query>
));
