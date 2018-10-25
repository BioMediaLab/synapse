const routes = require("next-routes");

// .add(name, pattern, page)
// you can leave out parrams if the route and page are the same as the route name
module.exports = routes()
  .add("index", "/")
  .add("admin")
  .add("users", "/users/:id")
  .add("courses", "/courses/:id")
  .add("login", "/login", "login")
  .add("google", "/auth/google", "finishLogin");
