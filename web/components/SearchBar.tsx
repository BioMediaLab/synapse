import React, { Component } from "react";
import Downshift from "downshift";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { Link } from "../Router";
import ProfilePic from "../components/ProfilePic";
import { fade } from "@material-ui/core/styles/colorManipulator";
import SearchIcon from "@material-ui/icons/Search";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SEARCH, UserQueryComp } from "../queries/userQueries";

const styles = theme =>
  createStyles({
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
      minWidth: "500px",
      maxHeight: "100vh",
      overflowY: "scroll",
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
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing.unit * 2,
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing.unit * 3,
        width: "auto",
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });

interface ISearchBarProps {
  classes: {
    paper: string;
    inputRoot: string;
    inputInput: string;
    search: string;
    searchIcon: string;
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
      <UserQueryComp
        query={SEARCH}
        variables={{ searchString: this.state.inputValue }}
      >
        {({ loading, error, data }) => {
          const searchIcon = loading ? (
            <CircularProgress size={24} />
          ) : (
            <SearchIcon />
          );

          return (
            <div className={classes.search}>
              <div className={classes.searchIcon}>{searchIcon}</div>
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
                  openMenu,
                }) => {
                  return (
                    <div>
                      <Input
                        {...getInputProps({
                          placeholder: "Search...",
                          onChange: this.handleInputChange,
                          onFocus: () => openMenu(),
                        })}
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        disableUnderline
                      />

                      {isOpen && data.userSearch ? (
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
            </div>
          );
        }}
      </UserQueryComp>
    );
  }
}

export default withStyles(styles)(SearchBar);
