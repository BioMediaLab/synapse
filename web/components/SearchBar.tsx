import React, { Component } from "react";
import Downshift from "downshift";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link } from "../Router";
import ProfilePic from "../components/ProfilePic";

const SEARCH = gql`
  query UserSearch($searchString: String!) {
    userSearch(name: $searchString, email: $searchString) {
      id
      email
      name
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
      minWidth: "500px",
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
                        <List>
                          {data.userSearch.length ? (
                            data.userSearch.map(user => {
                              return (
                                <Link
                                  route="users"
                                  params={{ id: user.id }}
                                  key={user.id}
                                >
                                  <ListItem button>
                                    <ProfilePic user={user} />
                                    <ListItemText
                                      primary={user.name}
                                      secondary={user.email}
                                    />
                                  </ListItem>
                                </Link>
                              );
                            })
                          ) : (
                            <ListItem>
                              <ListItemText primary="No search results." />
                            </ListItem>
                          )}
                        </List>
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
