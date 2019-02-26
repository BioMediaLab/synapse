import React from "react";
import { WithRouterProps, withRouter } from "next/router";
import { WithApolloClient, withApollo } from "react-apollo";
import {
  CourseRoleType,
  MY_ROLE_IN_A_COURSE,
  ICourseMyRoleResult,
} from "../queries/courseQueries";

export interface IWithUserObj {
  courseUserId: string;
  role: CourseRoleType;
}

export interface IWithCourseUserProps {
  userLoading: boolean;
  userFetchError: any;
  courseId: string;
  user?: IWithUserObj;
}

export declare type WithCourseUser<IProps extends object> = IProps &
  IWithCourseUserProps;

const withCourseUser = <P extends object>(
  Component: React.ComponentType<P & IWithCourseUserProps>,
): React.ComponentType<{ curCourseId?: string } & P> => {
  const decoredComp: React.ComponentType<
    WithApolloClient<P & WithRouterProps & { curCourseId?: string }>
  > = ({ router, client, curCourseId, children, ...props }) => {
    const [userFetchError, setError] = React.useState<boolean | any>(false);
    const [userLoading, setLoading] = React.useState(true);
    const [user, setUser] = React.useState<IWithUserObj | null>(null);

    const courseId: string = (curCourseId
      ? curCourseId
      : router.query.id) as any;
    React.useEffect(() => {
      client
        .query<ICourseMyRoleResult>({
          query: MY_ROLE_IN_A_COURSE,
          variables: { courseId },
        })
        .then(({ errors, data }) => {
          setLoading(false);
          if (errors) {
            setError(errors);
          }
          if (data.myRoleInCourse) {
            setUser({
              role: data.myRoleInCourse.user_type,
              courseUserId: data.myRoleInCourse.id,
            });
          }
        });
    }, [router.query]);

    const t = props as P;

    if (!user) {
      return (
        <Component
          userFetchError={userFetchError}
          userLoading={userLoading}
          courseId={courseId}
          {...t}
        />
      );
    }
    return (
      <Component
        userFetchError={userFetchError}
        userLoading={userLoading}
        user={user}
        courseId={courseId}
        {...t}
      />
    );
  };

  return withApollo(withRouter(decoredComp)) as any;
};

export default withCourseUser;
