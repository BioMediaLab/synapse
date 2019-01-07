import "react-testing-library/cleanup-after-each";
import React from "react";
import { render } from "react-testing-library";
import GradebookStats from "../components/GradebookStats";

test("mounts", () => {
  const { container } = render(<GradebookStats />);
  expect(container).toMatchSnapshot();
});
