import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Link from "next/link";

export default function(course) {
  return (
    <ListItem>
      <Avatar>{course.name.charAt(0).toUpperCase()}</Avatar>
      <ListItemText primary={course.name} />
    </ListItem>
  );
}
