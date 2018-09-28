const routes = require("next-routes");

module.exports = routes()
  .add({
    name: "index",
    pattern: "/",
    page: "index"
  })
  .add("home", "/home", "index")
  .add("users", "/users/:id")
  .add("courses", "/courses", "users")
  .add("login", "/login", "login")
  .add("google", "/auth/google", "finishLogin");
