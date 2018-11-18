import Typography from "@material-ui/core/Typography";
import { createStyles, withStyles, Grid, Button } from "@material-ui/core";
import { Settings as SettingsIcon } from "@material-ui/icons";
import { Link } from "../Router";

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
    id: string;
  };
  classes: {
    root: string;
  };
}

const CourseHeader: React.SFC<ICourseHeaderProps> = ({ course, classes }) => (
  <div className={classes.root}>
    <Grid container alignItems="flex-end" justify="space-between">
      <Typography variant="display1">{course.name}</Typography>
      <Link route="courseTools" params={{ id: course.id }}>
        <Button>
          <SettingsIcon />
          Settings
        </Button>
      </Link>
    </Grid>
    <Typography variant="subheading" gutterBottom>
      {course.users.length} students
    </Typography>

    <Typography variant="body1" gutterBottom>
      {course.description}
    </Typography>
  </div>
);

export default withStyles(styles, { withTheme: true })(CourseHeader);
