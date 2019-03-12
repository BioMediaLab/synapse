import React from "react";
import { render } from "react-testing-library";
import SnackbarMessage from "../components/SnackbarMessage";

const graphqlErrorObject = { message: "GraphQL error: graphql error message" };

test("renders", () => {
  const { container } = render(
    <>
      <SnackbarMessage message="message" />
      <SnackbarMessage error message="error message" />
      <SnackbarMessage error message={graphqlErrorObject} />
      <SnackbarMessage success message="success message" />
      <SnackbarMessage info message="info message" />
      <SnackbarMessage warning message="warning message" />
    </>,
  );
  expect(container).toMatchSnapshot();
});
