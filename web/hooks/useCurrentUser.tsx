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

  console.log("DATERZ", data);
  console.log("ERROR", error);

  return {
    user: data.currentUser ? data.currentUser : null,
    error,
  };
};
