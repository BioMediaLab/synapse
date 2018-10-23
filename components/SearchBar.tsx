import React, { Component } from "react";
import Downshift from "downshift";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { classNames } from "react-select/lib/utils";
import { Link } from "../Router";

const SEARCH = gql`
  query UserSearch($searchString: String!) {
    userSearch(name: $searchString, email: $searchString) {
      name
      id
      photo
      nickname
    }
  }
`;

const styles = theme =>
  createStyles({
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
  });

type Props = {
  classes: {
    paper;
  };
};

class SearchBar extends Component<Props> {
  state = {
    inputValue: "",
  };

  handleInputChange = event => {
    console.log("inputValue", event.target.value);
    this.setState({ inputValue: event.target.value });
  };

  render() {
    console.log("this.state.inputValue", this.state.inputValue);
    const { classes } = this.props;

    return (
      <Query query={SEARCH} variables={{ searchString: this.state.inputValue }}>
        {({ loading, error, data }) => {
          if (loading) <div>Loading...</div>;
          if (error) <div>Error...</div>;

          console.log("data", data);
          return (
            <Downshift>
              {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
              }) => {
                return (
                  <div>
                    <Input
                      {...getInputProps({
                        placeholder: "Search...",
                        onChange: this.handleInputChange,
                      })}
                      disableUnderline
                    />

                    {isOpen ? (
                      <Paper square>
                        {data.userSearch.map(user => {
                          return (
                            <Link
                              route="users"
                              params={{ id: user.id }}
                              key={user.id}
                            >
                              <MenuItem component="div">{user.name}</MenuItem>
                            </Link>
                          );
                        })}
                      </Paper>
                    ) : null}
                  </div>
                );
              }}
            </Downshift>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(SearchBar);
