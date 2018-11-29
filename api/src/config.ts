import * as dotenv from "dotenv";

/*
Where a new environment variable is needed
be sure to add it to this list.
*/
const envVarWhitelist = new Set([
  "PRISMA_ENDPOINT",
  "PRISMA_SECRET",
  "PRISMA_MANAGEMENT_API_SECRET",
  "GOOGLE_APP_REDIRECT_URL",
  "GOOGLE_APP_SECRET",
  "GOOGLE_APP_CLIENT_ID",
]);

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

export default configSanityCheck;
