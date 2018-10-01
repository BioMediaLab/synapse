const routes = require("next-routes");

module.exports = routes()
  .add({
    name: "index",
    pattern: "/",
    page: "index",
  })
  .add("users", "/users/:id")
  .add("courses", "/courses", "courses")
  .add("login", "/login", "login")
  .add("google", "/auth/google", "finishLogin");
