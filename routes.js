const routes = require("next-routes");

// .add(name, pattern, page)

module.exports = routes()
  .add("index", "/")
  .add("users", "/users/:id")
  .add("courses", "/courses/:id", "courses")
  .add("login", "/login", "login")
  .add("google", "/auth/google", "finishLogin");
