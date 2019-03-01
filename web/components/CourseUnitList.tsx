import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import ErrorMessage from "./ErrorMessage";
import AddCourseUnitButton from "./AddCourseUnitButton";
import CourseUnitListItem from "./CourseUnitListItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const GET_COURSE_UNITS = gql`
  query($course_id: ID!) {
    courseUnits(course_id: $course_id) {
      id
      name
      description
      visible
      contentPieces {
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
`;

class CourseUnits extends Component {
  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
  };

  updateCourseUnitsCache = (cache, { data: { addCourseUnit } }) => {
    const data = cache.readQuery({
      query: GET_COURSE_UNITS,
      variables: {
        course_id: this.props.courseId,
      },
    });

    data.courseUnits = [...data.courseUnits, addCourseUnit];

    cache.writeQuery({
      query: GET_COURSE_UNITS,
      variables: { course_id: this.props.courseId },
      data,
    });
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <AddCourseUnitButton
            courseId={this.props.courseId}
            update={this.updateCourseUnitsCache}
          />
        </div>
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

            if (!data.courseUnits.length) {
              return <div>No content</div>;
            }

            return (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                      {data.courseUnits.map((unit, index) => (
                        <Draggable
                          key={unit.id}
                          draggableId={unit.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CourseUnitListItem
                                key={unit.id}
                                courseId={this.props.courseId}
                                unit={unit}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default CourseUnits;
