import React, { Component } from "react";
import {
  withStyles,
  createStyles,
  Theme,
  TextField,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import SnackbarMessage from "./SnackbarMessage";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

const GET_COURSES = gql`
  query {
    myCourseRoles {
      id
      course {
        id
        name
        requireActivation
      }
    }
    me {
      id
      name
    }
  }
`;

const ACTIVATION_CODE_USE_MUTATION = gql`
  mutation($activation_code: String!, $course_id: String!, $user_id: String!) {
    useActivationCode(
      activation_code: $activation_code
      course_id: $course_id
      user_id: $user_id
    ) {
      id
    }
  }
`;

const ACTIVATION_CODE_CLEAR_MUTATION = gql`
  mutation($activation_code: String!, $user_id: String!) {
    clearActivationCode(activation_code: $activation_code, user_id: $user_id) {
      id
    }
  }
`;

const ACTIVATION_CODE_CREATE_MUTATION = gql`
  mutation($activation_code: String!) {
    addActivationCode(activation_code: $activation_code) {
      id
    }
  }
`;

const styles = (theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit,
      width: 80,
      alignSelf: "flex-end",
    },
    formControl: {
      marginTop: 0,
    },
    flexDiv: {
      display: "flex",
      flexDirection: "column",
      maxWidth: 400,
    },
  });

interface IActivationCodeProps {
  isAdmin: boolean;
  classes: {
    button: string;
    formControl: string;
    flexDiv: string;
  };
}

interface IActivationCodeState {
  activationCode: string;
  newActivationCode: string;
  courseId: string;
  activationCodeToClear: string;
}

class ActivationCode extends Component<
  IActivationCodeProps,
  IActivationCodeState
> {
  state = {
    activationCode: "",
    newActivationCode: "",
    courseId: "",
    activationCodeToClear: "",
  };

  handleChange = name => event => {
    switch (name) {
      case "activationCode":
        this.setState({ activationCode: event.target.value });
        break;
      case "newActivationCode":
        this.setState({ newActivationCode: event.target.value });
        break;
      case "courseId":
        this.setState({ courseId: event.target.value });
        break;
      case "activationCodeToClear":
        this.setState({ activationCodeToClear: event.target.value });
        break;
      default:
        break;
    }
  };

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.flexDiv}>
        <Query query={GET_COURSES}>
          {({ loading, data }) => {
            if (loading) {
              return <div />;
            }
            const courses = data.myCourseRoles.map(role => role.course);
            return (
              <>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel>Course to Activate</InputLabel>
                  <Select
                    value={this.state.courseId}
                    onChange={this.handleChange("courseId")}
                  >
                    {courses.map(course => {
                      return course.requireActivation ? (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ) : null;
                    })}
                  </Select>
                </FormControl>
                <Mutation mutation={ACTIVATION_CODE_USE_MUTATION}>
                  {(doMutation, mutationResult) => {
                    return (
                      <>
                        <TextField
                          label="Activation Code"
                          placeholder="****-****-****-****"
                          value={this.state.activationCode}
                          fullWidth
                          onChange={this.handleChange("activationCode")}
                        />
                        <Button
                          variant="contained"
                          className={classes.button}
                          onClick={event => {
                            doMutation({
                              variables: {
                                activation_code: this.state.activationCode,
                                course_id: this.state.courseId,
                                user_id: data.me.id,
                              },
                            });
                            this.setState({
                              activationCode: "",
                              courseId: "",
                            });
                          }}
                        >
                          Activate
                        </Button>
                        {mutationResult.data ? (
                          <SnackbarMessage
                            success
                            message="Course Activation Successful!"
                          />
                        ) : null}
                        <SnackbarMessage error message={mutationResult.error} />
                      </>
                    );
                  }}
                </Mutation>
                <Mutation mutation={ACTIVATION_CODE_CLEAR_MUTATION}>
                  {(doMutation, mutationResult) => {
                    return (
                      <>
                        <TextField
                          label="Reset Activation Code"
                          placeholder="****-****-****-****"
                          fullWidth
                          onChange={this.handleChange("activationCodeToClear")}
                          value={this.state.activationCodeToClear}
                        />

                        <Button
                          variant="contained"
                          className={classes.button}
                          onClick={event => {
                            doMutation({
                              variables: {
                                activation_code: this.state
                                  .activationCodeToClear,
                                user_id: data.me.id,
                              },
                            });

                            this.setState({ activationCodeToClear: "" });
                          }}
                        >
                          Reset
                        </Button>
                        {mutationResult.data ? (
                          <SnackbarMessage
                            success
                            message="Activation Code Reset Successful!"
                          />
                        ) : null}
                        <SnackbarMessage error message={mutationResult.error} />
                      </>
                    );
                  }}
                </Mutation>
              </>
            );
          }}
        </Query>

        {this.props.isAdmin ? (
          <>
            <Mutation mutation={ACTIVATION_CODE_CREATE_MUTATION}>
              {(doMutation, mutationResult) => {
                return (
                  <>
                    <TextField
                      label="Create Activation Code"
                      placeholder="****-****-****-****"
                      fullWidth
                      onChange={this.handleChange("newActivationCode")}
                      value={this.state.newActivationCode}
                    />

                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={event => {
                        doMutation({
                          variables: {
                            activation_code: this.state.newActivationCode,
                          },
                        });

                        this.setState({ newActivationCode: "" });
                      }}
                    >
                      Create
                    </Button>
                    {mutationResult.data ? (
                      <SnackbarMessage
                        success
                        message="Activation Code Creation Successful!"
                      />
                    ) : null}
                    <SnackbarMessage error message={mutationResult.error} />
                  </>
                );
              }}
            </Mutation>
          </>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ActivationCode);
