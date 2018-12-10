import React from "react";
import {
  Icon,
  Grid,
  withStyles,
  createStyles,
  TextField,
  Divider,
  IconButton,
  Typography,
  Theme,
  Tooltip,
} from "@material-ui/core";
import { AddAlertRounded } from "@material-ui/icons";
import { format, setHours, setMinutes, addHours } from "date-fns";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import ErrorMessage from "./ErrorMessage";

const CREATE_REMINDER = gql`
  mutation($message: String!, $targetTime: String!) {
    createReminder(msg: $message, triggerTime: $targetTime) {
      id
    }
  }
`;

const DELETE_REMINDER = gql`
  mutation($reminder: String) {
    deleteReminder(id: $reminder) {
      id
    }
  }
`;

const VIEW_REMINDERS = gql`
  query {
    reminders {
      id
      msg
      add_data
      triggerTime
    }
  }
`;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: theme.spacing.unit,
    },
    adderRoot: {
      border: "0.2em solid",
      borderColor: theme.palette.divider,
      marginBottom: theme.spacing.unit,
      borderRadius: theme.spacing.unit,
      padding: theme.spacing.unit * 0.4,
    },
    adderTextField: {
      width: "40%",
      paddingLeft: "0.5em",
      paddingRight: "0.5em",
      marginTop: "-0.5em",
    },
    adderDateField: {
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      marginTop: "-0.5rem",
    },
    adderBottomRow: { padding: theme.spacing.unit },
  });

interface IProps {
  classes: {
    root: string;
    adderRoot: string;
    adderTextField: string;
    adderBottomRow: string;
    adderDateField: string;
  };
}

interface IState {
  dateValue: string;
  timeValue: string;
  msgValue: string;
}

class Reminders extends React.Component<IProps, IState> {
  state = {
    dateValue: format(new Date(), "YYYY-MM-DD"),
    timeValue: format(addHours(new Date(), 1), "hh:mm"),
    msgValue: "",
  };

  updateMessageValue = (newValue: string) => {
    this.setState(oldState => ({ ...oldState, msgValue: newValue }));
  };

  updateDateValue = (newDate: string) => {
    this.setState(oldState => ({ ...oldState, dateValue: newDate }));
  };

  updateTimeValue = (newTime: string) => {
    this.setState(oldState => ({ ...oldState, timeValue: newTime }));
  };

  resetAll = () => {
    this.setState(oldState => ({
      ...oldState,
      dateValue: format(new Date(), "YYYY-MM-DD"),
      timeValue: format(addHours(new Date(), 1), "hh:mm"),
      msgValue: "",
    }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Mutation
          mutation={CREATE_REMINDER}
          refetchQueries={[{ query: VIEW_REMINDERS }]}
        >
          {(create, { loading }) => {
            const readyToAddReminder =
              this.state.msgValue.length <= 1 && !loading;

            const createOnClick = () => {
              const targetTime = setMinutes(
                setHours(
                  new Date(this.state.dateValue),
                  parseInt(this.state.timeValue.split(":")[0], 10),
                ),
                parseInt(this.state.timeValue.split(":")[1], 10),
              );
              if (!loading && this.state.msgValue.length > 1) {
                create({
                  variables: { message: this.state.msgValue, targetTime },
                });
                this.resetAll();
              }
            };

            return (
              <Grid
                container
                justify="flex-start"
                className={classes.adderRoot}
              >
                <Grid item xs={1}>
                  <Grid container justify="space-around">
                    <Tooltip title="Add new reminder">
                      <div>
                        <IconButton
                          disabled={readyToAddReminder}
                          onClick={createOnClick}
                        >
                          <Icon>
                            <AddAlertRounded />
                          </Icon>
                        </IconButton>
                      </div>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid item xs={10}>
                  <Grid container direction="column">
                    <Grid container>
                      <span>Remember to</span>
                      <TextField
                        className={classes.adderTextField}
                        value={this.state.msgValue}
                        onChange={event =>
                          this.updateMessageValue(event.target.value)
                        }
                      />
                    </Grid>
                    <Grid container className={classes.adderBottomRow}>
                      <span> at </span>
                      <TextField
                        className={classes.adderDateField}
                        type="date"
                        value={this.state.dateValue}
                        onChange={event =>
                          this.updateDateValue(event.target.value)
                        }
                        inputProps={{
                          min: format(new Date(), "YYYY-MM-DD"),
                        }}
                      />
                      <TextField
                        className={classes.adderDateField}
                        type="time"
                        value={this.state.timeValue}
                        onChange={event =>
                          this.updateTimeValue(event.target.value)
                        }
                        inputProps={{
                          min: format(new Date(), "hh:mm"),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            );
          }}
        </Mutation>
        <Divider />
        <Typography variant="subtitle1">Upcoming Reminders</Typography>
        <Query query={VIEW_REMINDERS}>
          {({ loading, error, data }) => {
            if (loading) {
              return <div>Loading...</div>;
            }
            if (error) {
              return <ErrorMessage message={error.message} />;
            }
            return (
              <div>
                {data.reminders.map(rem => (
                  <div key={rem.id}>{rem.msg}</div>
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(Reminders);
