import React from "react";
import {
  withStyles,
  Typography,
  Select,
  MenuItem,
  createStyles,
} from "@material-ui/core";
import { graphql, ChildMutateProps } from "react-apollo";
import { withSnackbar, InjectedNotistackProps } from "notistack";

import AddMembers from "./AddMembers";
import { CourseRoleType, ADD_USERS_TO_COURSE } from "../queries/courseQueries";

const styles = theme =>
  createStyles({
    addDialog: {
      minWidth: theme.spacing.unit * 100,
      minHeight: theme.spacing.unit * 15,
    },
    fullDialog: {
      minHeight: theme.spacing.unit * 20,
    },
    roleSelect: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  });

interface IStyles {
  classes: {
    addDialog: string;
    fullDialog: string;
    roleSelect: string;
  };
}

interface IProps {
  curCourseId: string;
  userAddCallback?: (userIds: string[]) => void;
}

interface IVars {
  courseId: string;
  users: Array<{ user_id: string; role: string }>;
}

type Props = ChildMutateProps<
  IProps & IStyles & InjectedNotistackProps,
  { course: { id: string } },
  IVars
>;

const AddStudentsToCourse: React.FunctionComponent<Props> = ({
  curCourseId,
  mutate,
  userAddCallback,
  classes,
}) => {
  const [role, updateRole] = React.useState<CourseRoleType>(
    "PROFESSOR" as CourseRoleType,
  );

  return (
    <AddMembers
      onComplete={async users => {
        if (curCourseId && users.length > 0) {
          const res = await mutate({
            // TODO: support adding users of different types
            variables: {
              courseId: curCourseId,
              users: users.map(user => ({
                user_id: user.id,
                role,
              })),
            },
          });
          if (res && !res.errors) {
            if (userAddCallback) {
              userAddCallback(users.map(({ id }) => id));
            }
            return { success: true, message: "Users successfuly added" };
          }
        }
        return {
          success: false,
          message: "An error ocurred when adding users. Please try again.",
        };
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Add these users as</span>
        <Select
          className={classes.roleSelect}
          value={role}
          onChange={event => {
            const type = event.target.value;
            updateRole(type as any);
          }}
        >
          <MenuItem value="PROFESSOR">professors</MenuItem>
          <MenuItem value="ADMIN">administrators</MenuItem>
          <MenuItem value="STUDENT">students</MenuItem>
          <MenuItem value="ASSISTANT">teaching assistants</MenuItem>
          <MenuItem value="AUDITOR">auditors</MenuItem>
        </Select>
        <span>into the class.</span>
      </div>
    </AddMembers>
  );
};

export default graphql<IProps, {}, IVars>(ADD_USERS_TO_COURSE)(
  withSnackbar(withStyles(styles)(AddStudentsToCourse)),
);
