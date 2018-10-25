import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "../Router";

const CourseListItem = course => {
  return (
    <Link route="courses" params={{ id: course.id }} key={course.id}>
      <ListItem button>
        <Avatar>{course.name.charAt(0).toUpperCase()}</Avatar>
        <ListItemText primary={course.name} />
      </ListItem>
    </Link>
  );
};

export default CourseListItem;
