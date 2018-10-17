import React from "react";
import withAuth from "../lib/withAuth";
import { withRouter } from "next/router";
import { Router } from "next-routes";
import Typography from "@material-ui/core/Typography";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";

const COURSE_INFO = gql`
  query Course($courseId: String!) {
    course(id: $courseId) {
      name
      description
      users {
        id
        name
      }
    }
  }
`;

interface CoursesProps {
  router: Router;
}

class Courses extends React.Component<CoursesProps, any> {
  render() {
    const course_id = this.props.router.query.id;
    console.log(course_id);

    return (
      <Query query={COURSE_INFO} variables={{ courseId: course_id }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <ErrorMessage message={error.message} />;
          }
          const { course } = data;

          return <Typography variant="title">test</Typography>;
        }}
      </Query>
    );
  }
}

export default withAuth(withRouter(Courses));
