import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import ErrorMessage from "./ErrorMessage";
import CourseUnitListItem from "./CourseUnitListItem";

const GET_COURSE_UNITS = gql`
  query($course_id: ID!) {
    course(where: { id: $course_id }) {
      id
      units {
        id
        name
        description
        items {
          id
          name
          description
          url
          type
          updatedAt
          creator {
            id
            name
          }
        }
      }
    }
  }
`;

class CourseUnits extends Component {
  render() {
    return (
      <Query
        query={GET_COURSE_UNITS}
        variables={{ course_id: this.props.courseId }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <ErrorMessage message={error.message} />;
          }

          if (!data.course.units.length) {
            return <div>No content</div>;
          }

          return (
            <div>
              {data.course.units.map(unit => (
                <CourseUnitListItem unit={unit} />
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default CourseUnits;
