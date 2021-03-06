import React from "react";
import { withRouter, WithRouterProps } from "next/router";
import {
  LinearProgress,
  withStyles,
  createStyles,
  Typography,
  Paper,
  Divider,
  Theme,
  Grid,
  Button,
} from "@material-ui/core";
import { KeyboardReturn as BackIcon } from "@material-ui/icons";
import { Query } from "react-apollo";

import withAuth from "../lib/withAuth";
import ErrorMessage from "../components/ErrorMessage";
import BigTextEdit from "../components/BigTextEdit";
import StudentAdminView from "../components/StudentAdminView";
import { Link } from "../Router";
import {
  COURSE_QUERY,
  COURSE_DESC_MUTATION,
  CourseDescMutation,
} from "../queries/courseQueries";

const styles = (theme: Theme) =>
  createStyles({
    mainLoadingInd: {
      marginTop: theme.spacing.unit * -3,
      width: "200%",
      marginLeft: theme.spacing.unit * -5,
    },
    toolSection: {
      margin: theme.spacing.unit * 2,
      width: "95%",
    },
    toolTitle: {
      backgroundColor: theme.palette.grey[100],
      paddingLeft: theme.spacing.unit,
    },
    toolSectionMainContent: {
      paddingLeft: theme.spacing.unit,
    },
  });

interface IStyles {
  classes: {
    mainLoadingInd: string;
    toolSection: string;
    toolTitle: string;
    toolSectionMainContent: string;
  };
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
              <Grid container justify="space-between">
                <Typography variant="h4">
                  {data.course.name} Class Settings
                </Typography>
                <Link route="courses" params={{ id: router.query.id as any }}>
                  <Button>
                    <BackIcon />
                    Back to course
                  </Button>
                </Link>
              </Grid>
              <Paper className={classes.toolSection}>
                <Typography className={classes.toolTitle} variant="subtitle1">
                  Course Properties
                </Typography>
                <Divider />
                <div className={classes.toolSectionMainContent}>
                  <CourseDescMutation mutation={COURSE_DESC_MUTATION}>
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
                  </CourseDescMutation>
                </div>
              </Paper>
              <Paper className={classes.toolSection}>
                <Typography className={classes.toolTitle} variant="subtitle1">
                  Manage Students and Users
                </Typography>
                <Divider />
                <div className={classes.toolSectionMainContent}>
                  <StudentAdminView courseId={courseId} />
                </div>
              </Paper>
            </div>
          );
        }}
      </Query>
    </main>
  );
};

export default withAuth(withRouter(withStyles(styles)(CourseTools)));
