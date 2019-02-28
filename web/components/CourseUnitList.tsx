import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import ErrorMessage from "./ErrorMessage";
import AddCourseUnitButton from "./AddCourseUnitButton";
import CourseUnitListItem from "./CourseUnitListItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const GET_COURSE_UNITS = gql`
  query($course_id: ID!) {
    course(id: $course_id) {
      id
      units {
        id
        name
        description
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
  }
`;

const updateCourseUnitsCache = (cache, newUnit) => {
  console.log("newUnit", newUnit);
  console.log("cache", cache);
  const oldUnits = cache.readQuery({ query: GET_COURSE_UNITS });
  console.log("oldUnits", oldUnits);

  /*cache.writeQuery({
    query: GET_COURSE_UNITS,
    data: {
      units: oldUnits.course.units.concat(newUnit.data.addCourseUnit),
    },
  });*/
};

class CourseUnits extends Component {
  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <AddCourseUnitButton
            courseId={this.props.courseId}
            update={updateCourseUnitsCache}
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

            if (!data.course.units.length) {
              return <div>No content</div>;
            }

            return (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                      {data.course.units.map((unit, index) => (
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
