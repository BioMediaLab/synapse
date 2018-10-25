import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import gql from "graphql-tag";
//see https://react-select.com/async#loading-asynchronously
import AsyncSelect from 'react-select/lib/Async';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import Avatar from '@material-ui/core/Avatar';
// No server side render component
import NoSsr from '@material-ui/core/NoSsr';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, withStyles } from '@material-ui/core/styles';

const SEARCH = gql`
  query UserSearch($searchString: String!) {
    userSearch(name: $searchString, email: $searchString) {
      name
      id
      photo
      nickname
      email
    }
  }
`;

const COURSE_SEARCH = gql`
  query UserSearch($searchString: String!, $courseId: String!) {
    userSearch(name: $searchString, email: $searchString, course_id: $courseId) {
      name
      id
      photo
      nickname
      email
    }
  }
`;

const styles = createStyles((theme) => ({
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
  }
}));

const inputComponent = ({ inputRef, ...props }) =>
  (<div ref={inputRef} {...props} />);

interface User {
  value: string,
  label: string,
  name: string,
  photo: string,
  nickname: string,
  email: string,
}

interface UserSearchProps {
  onValueChange?(users: User[]): void,
  courseId?: string | null,
  disabled?: boolean,
  classes: {
    input: string,
    main: string,
    chip: string,
  },
  theme: any,
}

// this type must be defined due to a bug in react-apollo typing, see
// https://github.com/apollographql/react-apollo/issues/1759
type UserSearchPropsApollo = WithApolloClient<UserSearchProps>;

interface UserSearchState {
  value: User[],
}

class UserSearch extends React.Component<UserSearchPropsApollo, UserSearchState> {
  static defaultProps = {
    disabled: false,
    courseId: null,
  };

  state = {
    value: [],
  };

  // components are defined in the class
  // so they can access `this.props.classes`
  // without being wrapped in withStyles()() themselves
  // because that will break typescript.
  multivalue = (chipProps) => {
    return (
      <Tooltip title={chipProps.data.email}>
        <Chip
          className={this.props.classes.chip}
          avatar={<Avatar alt={chipProps.data.name} src={chipProps.data.photo} />}
          tabIndex={-1}
          label={chipProps.children}
          onDelete={chipProps.removeProps.onClick}
          deleteIcon={<CancelIcon {...chipProps.removeProps} />}
        />
      </Tooltip>
    );
  };

  controlComponent = (compProps) => {
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

  loadOptions = async (input: string): Promise<User[]> => {
    // clean and sanitize input
    const searchString = input.replace(/  */, " ").replace(/^ | $/, '').toLocaleLowerCase();
    try {
      const queryOpts = (this.props.courseId !== null) ? {
        query: COURSE_SEARCH,
        variables: {
          searchString,
          courseId: this.props.courseId,
        }
      } : {
        query: SEARCH,
        variables: { searchString },
      } as any; // quieting typescript

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
        photo: user.photo,
        email: user.email,
      }));
    } catch (err) {
      console.warn(err);
      return [];
    }
  }

  // a callback from AsyncSelect when a user selects an option
  inputChange = (users: User[]) => {
    this.setState(state => ({
      ...state,
      value: users,
    }));
    if (this.props.onValueChange) {
      this.props.onValueChange(users);
    }
  };

  // Gives a more helpful tooltip if the user hasn't yet begun typing
  createNoOptionsMessage = ({ inputValue }: { inputValue: string }): string => {
    if (inputValue == '') {
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
        '& input': {
          font: 'inherit',
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
          }}
          options={[classes]}
        />
      </NoSsr>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withApollo(UserSearch));
