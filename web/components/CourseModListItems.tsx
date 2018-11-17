import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CourseHomeIcon from "@material-ui/icons/Home";
import CourseFilesIcon from "@material-ui/icons/Folder";
import GradebookIcon from "@material-ui/icons/Assessment";
import CourseAdminIcon from "@material-ui/icons/Settings";

const CourseModListItems = course => {
  return (
    <List>
      <ListItem button>
        <CourseHomeIcon />
        <ListItemText>Home</ListItemText>
      </ListItem>
      <ListItem button>
        <CourseFilesIcon />
        <ListItemText>Files</ListItemText>
      </ListItem>
      <ListItem button>
        <GradebookIcon />
        <ListItemText>Grades</ListItemText>
      </ListItem>
      <ListItem button>
        <CourseAdminIcon />
        <ListItemText>Admin</ListItemText>
      </ListItem>
    </List>
  );
};

export default CourseModListItems;
