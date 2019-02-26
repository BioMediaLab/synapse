import React from "react";
import ReactPlaceholder from "react-placeholder";
import { TextBlock, RoundShape } from "react-placeholder/lib/placeholders";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItem from "./CourseListItem";
import { Link } from "../Router";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import "react-placeholder/lib/reactPlaceholder.css";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MessagesIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import ListSubheader from "@material-ui/core/ListSubheader";
import { withRouter } from "next/router";
import {
  GET_COURSES,
  ICourse,
  QueryGetCourses,
} from "../queries/courseQueries";

const customPlaceholderUser = (
  <div className="customPlaceHolder">
    <RoundShape
      color="silver"
      style={{ height: 40, width: 40, float: "left", marginLeft: 4 }}
    />
    <TextBlock
      color="silver"
      rows={2}
      style={{ height: 40, maxWidth: 125, marginLeft: 60 }}
    />
  </div>
);
const customPlaceholderCourse = (
  <div className="customPlaceHolder">
    <TextBlock
      color="silver"
      rows={1}
      style={{ height: 40, paddingTop: 10, borderRadius: "15px" }}
    />
  </div>
);

const CourseList: React.SFC<{}> = ({ router, href }) => (
  <QueryGetCourses query={GET_COURSES}>
    {({ loading, error, data }) => {
      if (loading) {
        return (
          <div>
            <div style={{ margin: 20, marginBottom: 14 }}>
              <ReactPlaceholder
                showLoadingAnimation
                ready={false}
                customPlaceholder={customPlaceholderUser}
              >
                {" "}
              </ReactPlaceholder>
            </div>
            <Divider />
            <div style={{ margin: 20, marginTop: 11, marginBottom: 22 }}>
              <ReactPlaceholder
                showLoadingAnimation
                ready={false}
                customPlaceholder={customPlaceholderCourse}
              >
                {" "}
              </ReactPlaceholder>
            </div>
            <div style={{ margin: 20, marginTop: 11, marginBottom: 22 }}>
              <ReactPlaceholder
                showLoadingAnimation
                ready={false}
                customPlaceholder={customPlaceholderCourse}
              >
                {" "}
              </ReactPlaceholder>
            </div>
            <div style={{ margin: 20, marginTop: 11, marginBottom: 22 }}>
              <ReactPlaceholder
                showLoadingAnimation
                ready={false}
                customPlaceholder={customPlaceholderCourse}
              >
                {" "}
              </ReactPlaceholder>
            </div>
            <div style={{ margin: 20, marginTop: 11, marginBottom: 22 }}>
              <ReactPlaceholder
                showLoadingAnimation
                ready={false}
                customPlaceholder={customPlaceholderCourse}
              >
                {" "}
              </ReactPlaceholder>
            </div>
          </div>
        );
      }
      if (error) {
        return <ErrorMessage message={error.message} />;
      }
      const courses: ICourse[] = data.myCourseRoles.map(role => role.course);
      return (
        <div>
          <List>
            <Link
              route="users"
              params={{ id: data.currentUser.id }}
              key={data.currentUser.id}
            >
              <ListItem button>
                <Avatar
                  alt={data.currentUser.name}
                  src={data.currentUser.photo}
                />
                <ListItemText
                  primary={data.currentUser.name}
                  secondary={data.currentUser.email}
                />
              </ListItem>
            </Link>

            <Divider />

            <Link prefetch href="/dashboard" key="dashboard">
              <ListItem button>
                <DashboardIcon
                  color="inherit"
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
                />
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>

            <Link prefetch href="/messages" key="messages">
              <ListItem button>
                <MessagesIcon
                  color="inherit"
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
                />
                <ListItemText primary="Messages" />
              </ListItem>
            </Link>

            <Link prefetch href="/notifications" key="notifications">
              <ListItem button>
                <NotificationsIcon
                  color="inherit"
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
                />
                <ListItemText primary="Notifications" />
              </ListItem>
            </Link>

            <Link prefetch href="/calendar" key="calendar">
              <ListItem button>
                <CalendarIcon
                  color="inherit"
                  style={{ color: "rgba(0, 0, 0, 0.54)" }}
                />
                <ListItemText primary="Calendar" />
              </ListItem>
            </Link>

            <ListSubheader>MY COURSES</ListSubheader>

            {courses.map(course => (
              <CourseListItem course={course} key={course.id} />
            ))}
          </List>
        </div>
      );
    }}
  </QueryGetCourses>
);

export default withRouter(CourseList);
