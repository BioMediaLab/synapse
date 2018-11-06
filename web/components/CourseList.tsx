import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ReactPlaceholder from "react-placeholder";
import {
  TextBlock,
  MediaBlock,
  TextRow,
  RectShape,
  RoundShape,
} from "react-placeholder/lib/placeholders";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItem from "./CourseListItem";
import { Link } from "../Router";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import { MenuItem } from "@material-ui/core";

interface ICourse {
  id: string;
  name: string;
}

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
    <RoundShape
      color="silver"
      style={{ height: 40, width: 40, float: "left", marginLeft: 4 }}
    />
    <TextBlock
      color="silver"
      rows={1}
      style={{ height: 40, maxWidth: 75, paddingTop: 10, marginLeft: 60 }}
    />
  </div>
);
const GET_COURSES = gql`
  {
    courses {
      id
      name
    }
    me @client {
      isAdmin
      id
      name
      email
      photo
    }
  }
`;

const CourseList: React.SFC<{}> = () => (
  <Query query={GET_COURSES}>
    {({ loading, error, data }) => {
      if (loading) {
        return (
          <div>
            <div style={{ margin: 20, marginBottom: 14 }}>
              <ReactPlaceholder
                ready={false}
                customPlaceholder={customPlaceholderUser}
              >
                {" "}
              </ReactPlaceholder>
            </div>
            <Divider />
            <div style={{ margin: 20, marginTop: 11, marginBottom: 22 }}>
              <ReactPlaceholder
                ready={false}
                customPlaceholder={customPlaceholderCourse}
              >
                {" "}
              </ReactPlaceholder>
            </div>
            <div style={{ margin: 20, marginTop: 11, marginBottom: 15 }}>
              <ReactPlaceholder
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
      const courses: ICourse[] = data.courses;
      return (
        <div>
          <List>
            <Link route="users" params={{ id: data.me.id }} key={data.me.id}>
              <ListItem button>
                <Avatar alt={data.me.name} src={data.me.photo} />
                <ListItemText
                  primary={data.me.name}
                  secondary={data.me.email}
                />
              </ListItem>
            </Link>

            <Divider />

            {data.me.isAdmin ? (
              <Link href="/admin" key="admin">
                <ListItem button>
                  <Avatar>A</Avatar>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </Link>
            ) : null}

            {courses.map(CourseListItem)}
          </List>
        </div>
      );
    }}
  </Query>
);

export default CourseList;
