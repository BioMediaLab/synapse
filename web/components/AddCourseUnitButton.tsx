import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const ADD_COURSE_UNIT = gql`
  mutation AddCourseUnit(
    $course_id: ID!
    $name: String!
    $description: String!
    $visible: Boolean
  ) {
    addCourseUnit(
      course_id: $course_id
      name: $name
      description: $description
      visible: $visible
    ) {
      id
      name
    }
  }
`;

class AddCourseUnitButton extends Component<{ courseId: string }> {
  state = {
    open: false,
    unit: {
      name: "",
      description: "",
      visible: false,
    },
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleInputChange = name => event => {
    this.setState({
      unit: {
        ...this.state.unit,
        [name]: event.target.value,
      },
    });
  };

  handleToggleVisibility = () => {
    this.setState({
      unit: {
        ...this.state.unit,
        visibile: !this.state.unit.visible,
      },
    });
  };

  handleAddUnitToCourse = () => {
    console.warn("unimpl...");
  };

  render() {
    return (
      <Mutation mutation={ADD_COURSE_UNIT}>
        {addCourseUnit => (
          <div>
            <Button variant="contained" onClick={this.handleClickOpen}>
              Add Unit
            </Button>

            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Add unit to course
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You can organize your course content by creating Units and
                  placing relevant course media inside. Fill out the settings
                  below and then hit the ADD button. Don't worry you can always
                  edit the settings later.
                </DialogContentText>

                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  fullWidth
                  onChange={this.handleInputChange("name")}
                />

                <TextField
                  autoFocus
                  margin="dense"
                  id="description"
                  label="Description"
                  type="text"
                  fullWidth
                  multiline
                  onChange={this.handleInputChange("description")}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.unit.visible}
                      onChange={this.handleToggleVisibility}
                      value={this.state.unit.visible}
                      color="primary"
                    />
                  }
                  label="Visible"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    addCourseUnit({
                      variables: {
                        course_id: this.props.courseId,
                        name: this.state.unit.name,
                        description: this.state.unit.description,
                        visibile: this.state.unit.visible,
                      },
                    });
                    this.handleClose();
                  }}
                  color="primary"
                >
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </Mutation>
    );
  }
}

export default AddCourseUnitButton;
