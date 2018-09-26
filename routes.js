const routes = require("next-routes");

module.exports = routes()
  .add("/", "index")
  .add("users", "/user/:id")
  .add("courses", "/courses", "users")
  .add("login");
