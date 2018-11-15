import React from "react";
import { withRouter, WithRouterProps } from "next/router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import {
  LinearProgress,
  withStyles,
  createStyles,
  Typography,
  Paper,
  Divider,
} from "@material-ui/core";

import withAuth from "../lib/withAuth";
import ErrorMessage from "../components/ErrorMessage";
import BigTextEdit from "../components/BigTextEdit";
import StudentAdminView from "../components/StudentAdminView";

const COURSE_QUERY = gql`
  query($id: ID!) {
    course(where: { id: $id }) {
      name
      description
      id
    }
  }
`;

const COURSE_DESC_MUTATION = gql`
  mutation($desc: String!, $id: String!) {
    updateCourseDescription(course_id: $id, description: $desc) {
      name
      description
      id
    }
  }
`;

const styles = theme =>
  createStyles({
    mainLoadingInd: {
      marginTop: theme.spacing.unit * -3,
      width: "200%",
      marginLeft: theme.spacing.unit * -5,
    },
    toolSection: {
      margin: theme.spacing.unit * 2,
      width: "95%",
      paddingLeft: theme.spacing.unit,
    },
  });

interface IStyles {
  classes: { mainLoadingInd: string; toolSection: string };
}

type PageProps = IStyles & WithRouterProps;

const CourseTools: React.SFC<PageProps> = ({ router, classes }) => {
  const courseId =
    typeof router.query.id === "string" ? router.query.id : router.query.id[0];

  return (
    <main>
      <Query query={COURSE_QUERY} variables={{ id: courseId }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <LinearProgress className={classes.mainLoadingInd} />;
          }
          if (error || !data.course) {
            const message =
              error && error.message ? error.message : "Course was not found.";
            return <ErrorMessage message={message} />;
          }
          return (
            <div>
              <Typography variant="title">
                {data.course.name} Class Settings
              </Typography>
              <Paper className={classes.toolSection}>
                <Typography variant="subtitle1">Course Properties</Typography>
                <Divider />
                <Mutation mutation={COURSE_DESC_MUTATION}>
                  {(doMutate, { loading: mutationLoading }) => {
                    return (
                      <BigTextEdit
                        initialText={data.course.description}
                        onSaveCallback={desc => {
                          doMutate({
                            variables: { desc, id: courseId },
                          });
                        }}
                        title="Course Description"
                        disabled={mutationLoading}
                      />
                    );
                  }}
                </Mutation>
              </Paper>
              <Paper className={classes.toolSection}>
                <Typography variant="subtitle1">
                  Manage Students and Users
                </Typography>
                <Divider />
                <StudentAdminView courseId={courseId} />
              </Paper>
            </div>
          );
        }}
      </Query>
    </main>
  );
};

export default withAuth(withRouter(withStyles(styles)(CourseTools)));
