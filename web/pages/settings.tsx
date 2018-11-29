import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import Button from "@material-ui/core/Button";
import withAuth from "../lib/withAuth";
import { withRouter } from "next/router";
import { Router } from "next-routes";

interface IUserProps {
  user_id: object;
  router: Router;
}

const getUser = gql`
  query {
    me @client {
      id
      name
      email
      bio
      iClickerID
    }
  }
`;

const updateUserMutation = gql`
  mutation updateUserMutation(
    $id: ID!
    $name: String
    $bio: String
    $iClickerID: String
  ) {
    updateUser(
      id: $id
      name: $name
      description: $description
      iClickerID: $iClickerID
    )
  }
`;

// const UserProfile: React.SFC<IUserProps> = () => {
class UserProfile extends Component {
  state = {
    name: "",
    email: "",
    bio: "",
    iClicker: "",
    id: "",
  };

  updateUser = async (e, updateUserMutation) => {
    e.preventDefault();
    console.log("updating user");
    const res = await updateUserMutation({
      variables: {
        id: this.props.id,
      },
    });
    console.log("fully updated!!");
  };

  handleChangeName = e => {
    const name = e.target.value;
    //console.log({ name, placeholder, value });
    // const val = type === "number" ? parseFloat(value) : value;
    this.setState({
      name,
    });
  };
  handleChangeEmail = e => {
    const email = e.target.value;
    //console.log({ name, placeholder, value });
    // const val = type === "number" ? parseFloat(value) : value;
    this.setState({
      email,
    });
  };

  handleChangeBio = e => {
    const bio = e.target.value;
    //console.log({ name, placeholder, value });
    // const val = type === "number" ? parseFloat(value) : value;
    this.setState({
      bio,
    });
  };

  handleChangeIClicker = e => {
    const iClicker = e.target.value;
    //console.log({ name, placeholder, value });
    // const val = type === "number" ? parseFloat(value) : value;
    this.setState({
      iClicker,
    });
  };

  render() {
    return (
      //should have a mutation here?
      <Query query={getUser}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <ErrorMessage message={error.message} />;
          }
          if (data) {
            console.log(data);
          }

          return (
            <form
              onSubmit={e => {
                e.preventDefault();
                console.log(this.state);
              }}
            >
              <TextField
                name="Name"
                label={data.me.name}
                placeholder="New name"
                helperText="Update Name"
                value={this.state.name}
                onChange={this.handleChangeName}
              />
              <br />
              <br />
              <TextField
                id="Email"
                label={data.me.email}
                placeholder="New email"
                helperText="Update Email"
                onChange={this.handleChangeEmail}
              />
              <br />
              <br />
              <TextField
                id="iClicker"
                label={data.me.iClickerID}
                placeholder="New iClicker ID"
                helperText="Update Iclicker ID"
                onChange={this.handleChangeIClicker}
              />
              <br />
              <br />
              <TextField
                id="Bio"
                label={data.me.bio}
                placeholder="New Bio"
                helperText="Update Bio"
                fullWidth
                multiline
                onChange={this.handleChangeBio}
              />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                className="submit-button"
                type="submit"
              >
                Sav{loading ? "ing" : "e"}
              </Button>
            </form>
          );
        }}
      </Query>
    );
  }
}

export default withAuth(withRouter(UserProfile));
