import React, { Component } from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import Typography from "@material-ui/core/Typography";
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
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

// const UserProfile: React.SFC<IUserProps> = () => {
class UserProfile extends Component {
  updateItem = async (e, updateUserMutation) => {
    e.preventDefault();
    console.log("Updating Item!!");
    // console.log(this.state);
    const res = await updateUserMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    console.log("Updated!!");
  };

  handleChange = e => {
    // const {name, type, value } = e.target;
    console.log(e.target.value);
    this.setState({
      name: e.target.value,
    });
  };

  render() {
    return (
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
            <form onSubmit={e => this.updateItem(e, updateItem)}>
              <TextField
                id="Name"
                label={data.me.name}
                placeholder="update name"
                helperText="Update Name"
              />
              <br />
              <br />
              <TextField
                id="Email"
                label={data.me.email}
                placeholder="update email"
                helperText="Update Email"
              />
              <br />
              <br />
              <TextField
                id="iClicker"
                label={data.me.iClickerID}
                placeholder="iClicker ID"
                helperText="Update Iclicker ID"
              />
              <br />
              <br />
              <TextField
                id="Bio"
                label={data.me.bio}
                placeholder="Bio"
                helperText="Update Bio"
                fullWidth
                multiline
              />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                className="submit-button"
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
