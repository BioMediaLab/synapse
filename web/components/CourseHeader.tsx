import Typography from "@material-ui/core/Typography";
import { createStyles, withStyles } from "@material-ui/core";

const styles = createStyles(theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
}));

interface ICourseHeaderProps {
  course: {
    name: string;
    description: string;
    users: any[];
  };
  classes: {
    root: string;
  };
}

const CourseHeader: React.SFC<ICourseHeaderProps> = ({ course, classes }) => (
  <div className={classes.root}>
    <Typography variant="display1">{course.name}</Typography>
    <Typography variant="subheading" gutterBottom>
      {course.users.length} students
    </Typography>

    <Typography variant="body1" gutterBottom>
      {course.description}
    </Typography>
  </div>
);

export default withStyles(styles, { withTheme: true })(CourseHeader);
