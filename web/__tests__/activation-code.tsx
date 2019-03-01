import "react-testing-library/cleanup-after-each";
import React from "react";
import { render } from "react-testing-library";
import ActivationCode from "../components/ActivationCode";
import { GET_COURSES } from "../components/ActivationCode";
import { MockedProvider } from "react-apollo/test-utils";

const mocks = [
  {
    request: {
      query: GET_COURSES,
    },
    result: {
      data: {
        myCourseRoles: {
          id: "testID01",
          course: {
            id: "testID02",
            name: "CourseName",
            requireActivation: true,
          },
        },
        me: {
          id: "testID03",
          name: "UserName",
        },
      },
    },
  },
];

test("renders", () => {
  const { container } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ActivationCode isAdmin />
    </MockedProvider>,
  );
  expect(container).toMatchSnapshot();
});
