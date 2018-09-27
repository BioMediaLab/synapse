const routes = require("next-routes");

module.exports = routes()
  .add("index", "/", "login")
  .add("home", "/home", "index")
  .add("users", "/users/:id")
  .add("courses", "/courses", "users")
  .add("login")
  .add("google", "/auth/google", "finishLogin");
