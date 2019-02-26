import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import gql from "graphql-tag";
import { withSnackbar, InjectedNotistackProps } from "notistack";
import {
  Button,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  Slide,
  Stepper,
  Step,
  StepLabel,
  Switch,
  FormControlLabel,
  createStyles,
  withStyles,
} from "@material-ui/core";

import CourseSearch from "./CourseSearch";
import AddMembers from "./AddMembers";
import { CREATE_COURSE, ADD_USERS_TO_COURSE } from "../queries/courseQueries";
import { GET_ME, IUser } from "../queries/userQueries";

const ADD_ME = gql`
  mutation($courseId: String!, $me: String!) {
    addUsersToCourse(
      course_id: $courseId
      users: [{ user_id: $me, role: ADMIN }]
    ) {
      id
      userRoles {
        id
        user_type
        user {
          id
          name
        }
      }
    }
  }
`;

const styles = theme =>
  createStyles({
    appBar: {
      position: "relative",
    },
    grow: {
      flexGrow: 1,
    },
    btnContainer: {
      margin: theme.spacing.unit * 2,
    },
    contentContainer: {
      margin: "auto",
      height: "100%",
    },
    instructionHeader: {
      marginLeft: theme.spacing.unit * -5,
      padding: theme.spacing.unit,
    },
  });

const Transition = props => <Slide direction="up" {...props} />;

interface ICreateCourseProps {
  classes: {
    appBar: string;
    grow: string;
    btnContainer: string;
    contentContainer: string;
    instructionHeader: string;
  };
}

interface ICreateCourseState {
  createFormOpen: boolean;
  courseName: string;
  courseDesc: string;
  stepIndex: number;
  selectedParent: any;
  addMeAsadmin: boolean;
  initialProfs: IUser[];
  initialStudents: IUser[];
}

interface ICreateCourseVars {
  name: string;
  description: string;
  parentId?: string;
}

type Props = WithApolloClient<ICreateCourseProps & InjectedNotistackProps>;

class NewCourse extends React.Component<Props, ICreateCourseState> {
  state = {
    createFormOpen: false,
    courseName: "",
    courseDesc: "",
    stepIndex: 0,
    selectedParent: null,
    addMeAsadmin: false,
    initialProfs: [],
    initialStudents: [],
  };

  openCreateForm = () => {
    this.setState(state => ({
      ...state,
      createFormOpen: true,
    }));
  };

  closeCreateForm = () => {
    this.setState(state => ({
      ...state,
      courseName: "",
      courseDesc: "",
      createFormOpen: false,
      stepIndex: 0,
      selectedParent: null,
    }));
  };

  createCourse = async () => {
    this.closeCreateForm();
    const variables: ICreateCourseVars = {
      name: this.state.courseName,
      description: this.state.courseDesc,
    };
    if (this.state.selectedParent && this.state.selectedParent.id) {
      (variables as any).parent_id = this.state.selectedParent.id;
    }
    const result = await this.props.client.mutate({
      mutation: CREATE_COURSE,
      variables,
    });

    let wasThereAnError: boolean = false;
    if (!result || result.errors) {
      wasThereAnError = true;
    }

    if (!wasThereAnError) {
      const users = [
        ...this.state.initialProfs.map(user => ({
          user_id: user.id,
          role: "PROFESSOR",
        })),
        ...this.state.initialStudents.map(user => ({
          user_id: user.id,
          role: "STUDENT",
        })),
      ];
      if (users.length > 0) {
        const addResult = await this.props.client.mutate({
          mutation: ADD_USERS_TO_COURSE,
          variables: {
            users,
            courseId: (result.data as any).createCourse.id,
          },
        });
        if (!addResult || addResult.errors) {
          wasThereAnError = true;
        }
      }
      if (this.state.addMeAsadmin) {
        const me = await this.props.client.query({ query: GET_ME });
        if (!me || !me.data || me.errors) {
          wasThereAnError = true;
        } else {
          // TODO: this could probably be typed better
          const userAddResult = await this.props.client.mutate({
            mutation: ADD_ME,
            variables: {
              courseId: (result.data as any).createCourse.id,
              me: (me.data as any).me.id,
            },
          });
          if (!userAddResult || userAddResult.errors) {
            wasThereAnError = true;
          }
        }
      }
    }
    if (wasThereAnError) {
      this.props.enqueueSnackbar("Failed to create course", {
        variant: "error",
      });
    } else {
      this.props.enqueueSnackbar("Course Created", {
        variant: "success",
      });
    }
  };

  nextEnabled = (): boolean => {
    switch (this.state.stepIndex) {
      case 0:
        if (
          this.state.courseName.length >= 1 &&
          this.state.courseDesc.length >= 1
        ) {
          return true;
        }
        return false;
      case 1:
        return true;
      case 2:
        return true;
    }
  };

  render() {
    const { classes } = this.props;
    let curStep = <React.Fragment />;
    if (this.state.stepIndex === 0) {
      // basic course info
      curStep = (
        <Grid container justify="center" direction="column">
          <Grid item>
            <Typography className={classes.instructionHeader}>
              Enter the basic information about the course:
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Course Name"
              required
              onChange={e => this.setState({ courseName: e.target.value })}
              value={this.state.courseName}
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              required
              label="Course Description"
              onChange={e => this.setState({ courseDesc: e.target.value })}
              value={this.state.courseDesc}
            />
          </Grid>
        </Grid>
      );
    } else if (this.state.stepIndex === 1) {
      // special options
      curStep = (
        <Grid container>
          <Grid item>
            <Typography className={classes.instructionHeader}>
              Select a parent course?
            </Typography>
          </Grid>
          <Grid item>
            <CourseSearch
              allCourses
              value={this.state.selectedParent}
              onChange={newCourse =>
                this.setState(state => ({
                  ...state,
                  selectedParent: newCourse,
                }))
              }
            />
          </Grid>
        </Grid>
      );
    } else if (this.state.stepIndex === 2) {
      // initial members
      curStep = (
        <Grid container direction="column">
          <Grid item>
            <Typography className={classes.instructionHeader}>
              Choose some initial members for the new course:
            </Typography>
          </Grid>
          <Grid item>
            <AddMembers
              buttonText="Professors"
              titleText="Choose initial professors for the course"
              onComplete={users => {
                this.setState(state => ({ ...state, initialProfs: users }));
                return null;
              }}
            />
            {this.state.initialProfs.length}
          </Grid>
          <Grid item>
            <AddMembers
              buttonText="Students"
              titleText="Choose initial students for the course"
              onComplete={users => {
                this.setState(state => ({ ...state, initialStudents: users }));
                return null;
              }}
            />
            {this.state.initialStudents.length}
          </Grid>
          <Grid item>
            <FormControlLabel
              label="set me as a course admin"
              control={
                <Switch
                  checked={this.state.addMeAsadmin}
                  onChange={() =>
                    this.setState(state => ({
                      ...state,
                      addMeAsadmin: !state.addMeAsadmin,
                    }))
                  }
                />
              }
            />
          </Grid>
        </Grid>
      );
    } else {
      // review page
      curStep = (
        <div>
          <Typography variant="h5">
            Confirm details of the new course
          </Typography>
          <ul>
            <li>
              <Typography>name: {this.state.courseName}</Typography>
            </li>
            <li>
              <Typography>description: {this.state.courseDesc}</Typography>
            </li>
          </ul>
        </div>
      );
    }

    const stepControlBtns = (
      <Grid container className={classes.btnContainer} justify="space-between">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={this.state.stepIndex === 0}
            onClick={() =>
              this.setState(state => ({
                ...state,
                stepIndex: state.stepIndex - 1,
              }))
            }
          >
            Back
          </Button>
        </Grid>
        <Grid item>
          {this.state.stepIndex <= 2 ? (
            <Button
              variant="contained"
              color="primary"
              disabled={!this.nextEnabled()}
              onClick={() =>
                this.setState(state => ({
                  ...state,
                  stepIndex: state.stepIndex + 1,
                }))
              }
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={this.createCourse}
            >
              Finish
            </Button>
          )}
        </Grid>
      </Grid>
    );

    return (
      <>
        <Button variant="contained" onClick={this.openCreateForm}>
          Create A New Course
        </Button>
        <Dialog
          fullScreen
          open={this.state.createFormOpen}
          onClose={this.closeCreateForm}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Create A New Course
              </Typography>
              <div className={classes.grow} />
              <Button
                color="inherit"
                onClick={this.closeCreateForm}
                aria-label="Close"
              >
                Cancel
              </Button>
            </Toolbar>
          </AppBar>
          <Stepper activeStep={this.state.stepIndex}>
            <Step>
              <StepLabel>Basic Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Other Options</StepLabel>
            </Step>
            <Step>
              <StepLabel>Members</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirm</StepLabel>
            </Step>
          </Stepper>
          <DialogContent>
            <Grid
              container
              direction="column"
              alignItems="center"
              spacing={24}
              className={classes.contentContainer}
            >
              <Grid item xs={7}>
                {curStep}
              </Grid>
              <Grid item xs={2}>
                {stepControlBtns}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default withApollo<{}>(withSnackbar(withStyles(styles)(NewCourse)));
