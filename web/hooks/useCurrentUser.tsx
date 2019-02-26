import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

const CurrentUserQuery = gql`
  query currentUserQuery {
    currentUser {
      id
      name
      email
      photo
    }
  }
`;

export const useCurrentUser = () => {
  const { data, error } = useQuery(CurrentUserQuery);

  return {
    user: data.currentUser ? data.currentUser : null,
    error,
  };
};
