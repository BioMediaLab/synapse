module.exports = {
  testEnvironment: "jest-environment-jsdom",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "\\.(js|ts|tsx)$": "ts-jest",
  },
  testRegex: "/__tests__/.*\\.(ts|tsx|js)$",
  moduleNameMapper: {
    "\\.css$": require.resolve("./test/style-mock.js"),
  },
  setupTestFrameworkScriptFile: require.resolve("./test/setup-tests.js"),
};
