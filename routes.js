const routes = require("next-routes");

module.exports = routes()
  .add("index", "/", "login")
  .add("users", "/user/:id")
  .add("courses", "/courses", "users")
  .add("login");
