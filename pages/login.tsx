import React from "react";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { withStyles, createStyles } from "@material-ui/core/styles";
// import Router from 'next/router'


const styles = theme => createStyles({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit * 3,
  },
  paper: {
    [theme.breakpoints.down('sm')]: {
      width: "90%",
    },
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 50,
    },
    margin: "auto",
    padding: theme.spacing.unit,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
  }
});

interface Props {
  classes: {
    layout: string,
    paper: string,
    title: string,
  }
};

const loginPage: React.SFC<Props> = (props) => {
  const { classes } = props;
  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <img src="/static/synapse-icon.png" alt="Synapse" />
        <Typography className={classes.title} variant="title" >
          Welcome to Synapse!
        </Typography>
        <Typography variant="subheading">
          To continue, please log in with your Umaine email.
        </Typography>
        <Button
          type="submit"
          variant="raised"
          color="primary"
        > Sign in with Google </Button>
      </Paper>
    </main>
  );
};

export default withStyles(styles)(loginPage);
