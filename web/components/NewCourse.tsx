import React from "react";
import { graphql, ChildMutateProps } from "react-apollo";
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
import { CREATE_COURSE } from "../queries/courseQueries";

const styles = theme =>
  createStyles({
    appBar: {
      position: "relative",
    },
    grow: {
      flexGrow: 1,
    },
  });

const Transition = props => <Slide direction="up" {...props} />;

interface ICreateCourseProps {
  classes: {
    appBar: string;
    grow: string;
  };
}

interface ICreateCourseState {
  createFormOpen: boolean;
  courseName: string;
  courseDesc: string;
  stepIndex: number;
  selectedParent: any;
  addMeAsadmin: boolean;
}

interface ICreateCourseVars {
  name: string;
  description: string;
  parentId?: string;
}

type Props = ICreateCourseProps &
  InjectedNotistackProps &
  ChildMutateProps<
    {},
    {
      createCourse: {
        name: string;
        id: string;
      };
    },
    ICreateCourseVars
  >;

class NewCourse extends React.Component<Props, ICreateCourseState> {
  state = {
    createFormOpen: false,
    courseName: "",
    courseDesc: "",
    stepIndex: 0,
    selectedParent: null,
    addMeAsadmin: false,
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
    const variables = {
      name: this.state.courseName,
      description: this.state.courseDesc,
    };
    if (this.state.selectedParent && this.state.selectedParent.id) {
      (variables as any).parent_id = this.state.selectedParent.id;
    }
    const result = await this.props.mutate({ variables });

    // If there was an error, we will sniff it out and then display a message to the user
    if (
      !result ||
      (result && (result.errors.length >= 0 || !result.data.createCourse.id))
    ) {
      this.props.enqueueSnackbar("Failed to create course", {
        variant: "error",
      });
      return;
    }
    if (this.state.addMeAsadmin) {
      // TODO: implement this
      console.log("add me as admin!");
    }
    this.props.enqueueSnackbar("Course Created", {
      variant: "success",
    });
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
      curStep = (
        <Grid container justify="center" direction="column">
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
      curStep = (
        <Grid container>
          <Grid item>
            <Typography> Select a parent course?</Typography>
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
      curStep = (
        <Grid container>
          <Typography>
            Choose some initial members for the new course:
          </Typography>
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
      );
    }

    const stepControlBtns = (
      <>
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
      </>
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
            {curStep}
            {stepControlBtns}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default graphql<{}, {}, ICreateCourseVars>(CREATE_COURSE)(
  withSnackbar(withStyles(styles)(NewCourse)),
);
