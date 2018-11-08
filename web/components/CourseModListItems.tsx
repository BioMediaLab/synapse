import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const CourseModListItems = course => {
  return (
    <List>
      <ListItem button>
        <ListItemText>Home</ListItemText>
      </ListItem>
      <ListItem button>
        <ListItemText>Course Content</ListItemText>
      </ListItem>
      <ListItem button>
        <ListItemText>Gradebook</ListItemText>
      </ListItem>
    </List>
  );
};

export default CourseModListItems;
