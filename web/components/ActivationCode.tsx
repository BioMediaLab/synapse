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
import ErrorMessageSoft from "../components/ErrorMessageSoft";
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

const ACTIVATION_CODE_CREATE_MUTATION = gql`
  mutation($activation_code: String!) {
    addActivationCode(activation_code: $activation_code) {
      id
    }
  }
`;

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      maxWidth: 400,
    },
    button: {
      margin: theme.spacing.unit,
    },
    formControl: {
      margin: theme.spacing.unit,
      marginTop: 0,
      minWidth: 170,
    },
  });

interface IActivationCodeProps {
  isAdmin: boolean;
  classes: {
    textField: string;
    button: string;
    formControl: string;
  };
}

interface IActivationCodeState {
  activationCode: string;
  newActivationCode: string;
  courseId: string;
}

class ActivationCode extends Component<
  IActivationCodeProps,
  IActivationCodeState
> {
  state = {
    activationCode: "",
    newActivationCode: "",
    courseId: "",
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
      default:
        break;
    }
  };

  render() {
    const classes = this.props.classes;
    return (
      <>
        <div>
          <Mutation mutation={ACTIVATION_CODE_USE_MUTATION}>
            {(doMutation, mutationResult) => {
              return (
                <>
                  <TextField
                    label="Activation Code"
                    placeholder="****-****-****-****"
                    className={classes.textField}
                    value={this.state.activationCode}
                    fullWidth
                    onChange={this.handleChange("activationCode")}
                  />
                  <Query query={GET_COURSES}>
                    {({ loading, data }) => {
                      if (loading) {
                        return <div />;
                      }
                      const courses = data.myCourseRoles.map(
                        role => role.course,
                      );
                      return (
                        <>
                          <FormControl className={classes.formControl}>
                            <InputLabel>Course to Activate</InputLabel>
                            <Select
                              value={this.state.courseId}
                              onChange={this.handleChange("courseId")}
                            >
                              {courses.map(course => {
                                if (course.requireActivation)
                                  return (
                                    <MenuItem key={course.id} value={course.id}>
                                      {course.name}
                                    </MenuItem>
                                  );
                              })}
                            </Select>
                          </FormControl>
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
                            Submit
                          </Button>
                          <ErrorMessageSoft error={mutationResult.error} />
                        </>
                      );
                    }}
                  </Query>
                </>
              );
            }}
          </Mutation>
        </div>
        {this.props.isAdmin ? (
          <div>
            <Mutation mutation={ACTIVATION_CODE_CREATE_MUTATION}>
              {(doMutation, mutationResult) => {
                if (mutationResult.error) {
                  return (
                    <ErrorMessage message={mutationResult.error.message} />
                  );
                }
                return (
                  <>
                    <TextField
                      label="Create Activation Code"
                      placeholder="****-****-****-****"
                      className={classes.textField}
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
                  </>
                );
              }}
            </Mutation>
          </div>
        ) : (
          <div />
        )}
      </>
    );
  }
}

export default withStyles(styles)(ActivationCode);
