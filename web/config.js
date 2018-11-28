const dotenv = require("dotenv");

/*
Where a new environment variable is needed
be sure to add it to this list.
*/
const envVarWhitelist = new Set(["API_URL", "API_URL_GOOGLE", "WEBSOCKET_URL"]);

const configSanityCheck = () => {
  const config = dotenv.config({ path: ".env" });
  if (config.error) {
    throw new Error("The app config could not be found. Check the .env file");
  }
  const envVars = Object.keys(config.parsed);
  const extraVars = envVars.filter(key => !envVarWhitelist.delete(key));
  extraVars.forEach(varName => {
    throw new Error(
      `${varName} is not a recognized environment variable. Remove it from the env config.`,
    );
  });
  envVarWhitelist.forEach(varName => {
    throw new Error(
      `The required variable ${varName} was not found in the .env config.`,
    );
  });
};

module.exports.config = configSanityCheck;
