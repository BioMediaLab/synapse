import React, { Component } from "react";
import Downshift from "downshift";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import gql from "graphql-tag";
import { Query } from "react-apollo";
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
    inputRoot: {
      color: "inherit",
      width: "100%",
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200,
      },
    },
  });

interface ISearchBarProps {
  classes: {
    paper: string;
    inputRoot: string;
    inputInput: string;
  };
}

class SearchBar extends Component<ISearchBarProps> {
  state = {
    inputValue: "",
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Query query={SEARCH} variables={{ searchString: this.state.inputValue }}>
        {({ loading, error, data }) => {
          if (loading) <div>Loading...</div>;
          if (error) <div>Error...</div>;

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
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      disableUnderline
                    />

                    {isOpen ? (
                      <Paper className={classes.paper} square>
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
