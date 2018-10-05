import React from "react";
import withAuth from "../lib/withAuth";
import { withRouter } from 'next/router'
import { Router } from "next-routes";
import Typography from "@material-ui/core/Typography";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const COURSE_INFO = gql`
  query Course($courseId: String!){
    course (id: $courseId) {
      name
      description
    }
  }
`;

interface CourseProps {
  router: Router
}

class Course extends React.Component<CourseProps, any> {
  render() {
    const query = this.props.router.query;
    const { course } = query;
    return (
      <Query query={COURSE_INFO} variables={{ courseId: course }}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <div>Loading...</div>
            )
          }
          if (error) {
            return (
              <div> Error! </div>
            );
          }
          const { course } = data;
          return (
            <Typography variant="title">{course.name}</Typography>
          );
        }}
      </Query>
    );
  }
}

export default withAuth(withRouter(Course));
