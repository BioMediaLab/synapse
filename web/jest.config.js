module.exports = {
  testEnvironment: "jest-environment-jsdom",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
  },
  testRegex: "/__tests__/.*\\.(ts|tsx|js)$",
  moduleNameMapper: {
    "\\.css$": require.resolve("./test/style-mock.js"),
  },
};
