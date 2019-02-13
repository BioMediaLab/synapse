import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import Button from "@material-ui/core/Button";

import { Router } from "../Router";
import { destroySessionFrontend } from "../lib/handleSessions";
import { REMOVE_ADMIN, MY_ID } from "../queries/userQueries";
import AreYouSure from "./AreYouSure";

const AdminResign = () => {
  const [showing, updateVisibility] = useState(false);

  return (
    <Query query={MY_ID}>
      {({ loading, error, data }) => {
        if (loading || error) {
          return <div />;
        }
        return (
          <Mutation mutation={REMOVE_ADMIN} variables={{ myId: data.me.id }}>
            {doResign => (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => updateVisibility(true)}
                >
                  Resign As Admin
                </Button>
                <AreYouSure
                  title="Permanently remove administrative access from your account?"
                  showing={showing}
                  yes={() => {
                    updateVisibility(false);
                    doResign();
                    Router.pushRoute("/");
                    destroySessionFrontend();
                  }}
                  no={() => updateVisibility(false)}
                >
                  You will be logged out. Click "yes" to proceed or "no" to
                  cancel.
                </AreYouSure>
              </>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default AdminResign;
