import React from "react";
import { Switch, Typography, FormControlLabel } from "@material-ui/core";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import AreYouSure from "./AreYouSure";
import ErrorMessage from "./ErrorMessage";
import ActivationCode from "./ActivationCode";

const ALL_ABOUT_ME = gql`
  query {
    me {
      id
      name
      acceptsEmails
      isAdmin
    }
  }
`;

const MUTATE_ME = gql`
  mutation($acceptsEmails: Boolean, $bio: String) {
    updateUserSettings(fields: { acceptsEmails: $acceptsEmails, bio: $bio }) {
      id
      acceptsEmails
      bio
      name
    }
  }
`;

interface IState {
  sendEmailConfirm: boolean;
}

class AccountSettings extends React.Component<{}, IState> {
  state = {
    sendEmailConfirm: false,
  };

  render() {
    return (
      <>
        <Query query={ALL_ABOUT_ME}>
          {({ loading, error, data }) => {
            if (loading) {
              return <div>loading...</div>;
            }
            if (error) {
              return <ErrorMessage message={error.message} />;
            }
            return (
              <div>
                <Mutation mutation={MUTATE_ME}>
                  {(doMutation, { loading: muteLoad }) => {
                    return (
                      <>
                        <FormControlLabel
                          control={
                            <Switch
                              disabled={muteLoad}
                              checked={data.me.acceptsEmails}
                              onChange={event => {
                                const checked = event.target.checked;
                                if (!checked) {
                                  this.setState(state => ({
                                    ...state,
                                    sendEmailConfirm: true,
                                  }));
                                  return;
                                }
                                doMutation({
                                  variables: { acceptsEmails: true },
                                });
                              }}
                            />
                          }
                          label="Recieve emails from Synapse"
                        />
                        <AreYouSure
                          showing={this.state.sendEmailConfirm}
                          yes={() => {
                            this.setState(state => ({
                              ...state,
                              sendEmailConfirm: false,
                            }));
                            doMutation({ variables: { acceptsEmails: false } });
                          }}
                          no={() =>
                            this.setState(state => ({
                              ...state,
                              sendEmailConfirm: false,
                            }))
                          }
                        >
                          <Typography variant="body2">
                            Are you sure that you wish to stop seeing email
                            notifications from Synapse?
                          </Typography>
                        </AreYouSure>
                      </>
                    );
                  }}
                </Mutation>
                <ActivationCode />
              </div>
            );
          }}
        </Query>
      </>
    );
  }
}

export default AccountSettings;
