import React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";

import AreYouSure from "../components/AreYouSure";

afterEach(cleanup);

test("<AreYouSure /> renders with correct text", () => {
  const { queryByText } = render(
    <AreYouSure showing yes={() => {}} no={() => {}} />,
  );

  expect(queryByText("Confirm?")).toBeTruthy();
});

test("<AreYouSure /> can be invisible", () => {
  const { queryByText } = render(
    <AreYouSure showing={false} yes={() => {}} no={() => {}} />,
  );

  expect(queryByText("Confirm?")).toBeNull();
});

test("<AreYouSure /> is interactive", () => {
  const mockYes = jest.fn(() => {});
  const mockNo = jest.fn(() => {});

  const { getByText } = render(
    <AreYouSure
      showing
      yes={mockYes}
      optionYesText="click-for-yes"
      no={mockNo}
      optionNoText="click-for-no"
    />,
  );

  fireEvent.click(getByText("click-for-yes"));
  expect(mockYes).toHaveBeenCalledTimes(1);
  fireEvent.click(getByText("click-for-no"));
  expect(mockNo).toHaveBeenCalledTimes(1);
  expect(mockYes).toHaveBeenCalledTimes(1);
});
