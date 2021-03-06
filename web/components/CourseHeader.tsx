import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, withStyles, Grid } from "@material-ui/core";

const styles = createStyles(theme => ({
  root: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  description: {
    color: "#A6ADB7",
  },
}));

interface ICourseHeaderProps {
  course: {
    name: string;
    title: string;
    description: string;
    term: string;
    users: any[];
    id: string;
  };
  classes: {
    root: string;
    description: string;
  };
}

const CourseHeader: React.FunctionComponent<ICourseHeaderProps> = ({
  course,
  classes,
}) => (
  <div className={classes.root}>
    <Grid container alignItems="flex-end" justify="space-between">
      <Typography variant="h4" style={{ fontWeight: 500 }}>
        {course.name} {course.term}
      </Typography>
    </Grid>

    <Typography variant="subtitle1" gutterBottom>
      {course.title}
    </Typography>

    <Typography variant="body2" gutterBottom className={classes.description}>
      {course.description}
    </Typography>
  </div>
);

export default withStyles(styles, { withTheme: true })(CourseHeader);
