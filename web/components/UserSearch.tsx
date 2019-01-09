import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
// see https://react-select.com/async#loading-asynchronously
import AsyncSelect from "react-select/lib/Async";
import CancelIcon from "@material-ui/icons/Cancel";
import { Chip, Paper, TextField, NoSsr, Tooltip } from "@material-ui/core";
import { createStyles, withStyles, Theme } from "@material-ui/core/styles";
import ProfilePic from "./ProfilePic";
import { SEARCH, IUser } from "../queries/userQueries";
import { COURSE_SEARCH } from "../queries/courseQueries";

const styles = createStyles(theme => ({
  input: {
    display: "flex",
    padding: 0,
    minHeight: theme.spacing.unit * 5.5,
  },
  main: {
    marginBottom: theme.spacing.unit,
  },
  chip: {
    marginRight: theme.spacing.unit,
  },
  menu: {
    position: "fixed",
    minWidth: "50%",
    zIndex: 2,
  },
}));

const inputComponent = ({ inputRef, ...props }) => (
  <div ref={inputRef} {...props} />
);

interface IUserSearchProps {
  disabled?: boolean;
  classes: {
    input: string;
    main: string;
    chip: string;
    menu: string;
  };
  theme: Theme;
  courseId?: string | null;
  onValueChange?(users: IUser[]): void;
}

// this type must be defined due to a bug in react-apollo typing, see
// https://github.com/apollographql/react-apollo/issues/1759
type UserSearchPropsApollo = WithApolloClient<IUserSearchProps>;

interface IUserSearchState {
  value: IUser[];
}

class UserSearch extends React.Component<
  UserSearchPropsApollo,
  IUserSearchState
> {
  static defaultProps = {
    disabled: false,
    courseId: null,
  };

  state = {
    value: [],
  };

  // Gives a more helpful tooltip if the user hasn't yet begun typing
  createNoOptionsMessage = ({ inputValue }: { inputValue: string }): string => {
    if (inputValue === "") {
      return "Begin typing a user's name or email";
    }
    return "No users found...";
  };

  render() {
    const { classes, theme } = this.props;

    // the AsyncSelect component allows styling
    // via an object of functions passed to the
    // styles prop
    // see https://react-select.com/styles#style-object
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit",
        },
      }),
    };

    return (
      <NoSsr>
        <AsyncSelect
          isDisabled={this.props.disabled}
          isMulti
          cacheOptions
          placeholder="Search for users by name or email"
          noOptionsMessage={this.createNoOptionsMessage}
          loadOptions={this.loadOptions}
          onChange={this.inputChange}
          value={this.state.value}
          styles={selectStyles}
          className={classes.main}
          components={{
            Control: this.controlComponent,
            MultiValue: this.multivalue,
            Menu: this.menu,
          }}
          options={[classes]}
        />
      </NoSsr>
    );
  }

  // components are defined in the class
  // so they can access `this.props.classes`
  // without being wrapped in withStyles()() themselves
  // because that will break typescript.
  private multivalue = chipProps => {
    return (
      <Tooltip title={chipProps.data.email}>
        <Chip
          className={this.props.classes.chip}
          avatar={
            <ProfilePic
              user={{ name: chipProps.data.name, photo: chipProps.data.photo }}
            />
          }
          tabIndex={-1}
          label={chipProps.children}
          onDelete={chipProps.removeProps.onClick}
          deleteIcon={<CancelIcon {...chipProps.removeProps} />}
        />
      </Tooltip>
    );
  };

  private menu = menuProps => {
    return (
      <Paper
        className={this.props.classes.menu}
        square
        {...menuProps.innerProps}
      >
        {menuProps.children}
      </Paper>
    );
  };

  private controlComponent = compProps => {
    return (
      <TextField
        fullWidth
        disabled={compProps.isDisabled}
        InputProps={{
          inputComponent,
          inputProps: {
            className: this.props.classes.input,
            inputRef: compProps.innerRef,
            children: compProps.children,
            ...compProps.innerProps,
          },
        }}
        {...compProps.selectProps.textFieldProps}
      />
    );
  };

  private loadOptions = async (input: string): Promise<IUser[]> => {
    // clean and sanitize input
    const searchString = input
      .replace(/  */, " ")
      .replace(/^ | $/, "")
      .toLocaleLowerCase();
    try {
      const queryOpts =
        this.props.courseId !== null
          ? {
              query: COURSE_SEARCH,
              variables: {
                searchString,
                courseId: this.props.courseId,
              },
            }
          : ({
              query: SEARCH,
              variables: { searchString },
            } as any); // quieting typescript

      const results = await this.props.client.query(queryOpts);

      if (results.errors) {
        console.warn(results.errors);
        return [];
      }
      const { userSearch } = results.data as any;
      return userSearch.map(user => ({
        label: user.name,
        name: user.name,
        nickname: user.nickname,
        value: user.id,
        id: user.id,
        photo: user.photo,
        email: user.email,
      }));
    } catch (err) {
      console.warn(err);
      return [];
    }
  };

  // a callback from AsyncSelect when a user selects an option
  private inputChange = (users: IUser[]) => {
    this.setState(state => ({
      ...state,
      value: users,
    }));
    if (this.props.onValueChange) {
      this.props.onValueChange(users);
    }
  };
}

export default withStyles(styles, { withTheme: true })(withApollo(UserSearch));
