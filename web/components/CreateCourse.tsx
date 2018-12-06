import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";

const CREATE_COURSE = gql`
  mutation CreateCourse($name: String!, $description: String!) {
    createCourse(name: $name, description: $description) {
      name
      id
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
    formMain: {
      marginTop: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 2,
    },
  });

const Transition = props => <Slide direction="up" {...props} />;

interface ICreateCourseProps {
  classes: {
    appBar: string;
    grow: string;
    formMain: string;
  };
}

interface ICreateCourseState {
  createFormOpen: boolean;
  courseName: string;
  courseDesc: string;
  showSnackbar: boolean;
  createSuccessful: boolean;
}

class CreateCourse extends React.Component<
  ICreateCourseProps,
  ICreateCourseState
> {
  state = {
    createFormOpen: false,
    courseName: "",
    courseDesc: "",
    showSnackbar: false,
    createSuccessful: true,
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
      createFormOpen: false,
    }));
  };

  closeSnackbar = () => {
    this.setState(state => ({
      ...state,
      showSnackbar: false,
    }));
  };

  createCourse = async creator => {
    this.closeCreateForm();
    const result = await creator();
    let status = true;
    if (result.error) {
      status = false;
    }
    if (!result.createCourse) {
      status = false;
    }
    this.setState(state => ({
      ...state,
      showSnackbar: true,
      createSuccessful: status,
    }));
  };

  render() {
    const { classes } = this.props;
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
              <Typography variant="title" color="inherit">
                Create A New Course
              </Typography>
              <div className={classes.grow} />
              <Mutation
                mutation={CREATE_COURSE}
                variables={{
                  name: this.state.courseName,
                  description: this.state.courseDesc,
                }}
              >
                {doMutation => {
                  return (
                    <Button
                      color="inherit"
                      onClick={() => {
                        this.createCourse(doMutation);
                      }}
                      aria-label="Close"
                    >
                      Create
                    </Button>
                  );
                }}
              </Mutation>
              <Button
                color="inherit"
                onClick={this.closeCreateForm}
                aria-label="Close"
              >
                Cancel
              </Button>
            </Toolbar>
          </AppBar>
          <form className={classes.formMain}>
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
                  label="Course Description"
                  onChange={e => this.setState({ courseDesc: e.target.value })}
                  value={this.state.courseDesc}
                />
              </Grid>
            </Grid>
          </form>
        </Dialog>
        <Snackbar
          open={this.state.showSnackbar}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          autoHideDuration={3000}
          onClose={this.closeSnackbar}
          message={
            this.state.createSuccessful ? (
              <span id="message-id"> Course Created</span>
            ) : (
              <span id="message-id"> Failed to create course</span>
            )
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnackbar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </>
    );
  }
}

export default withStyles(styles)(CreateCourse);
