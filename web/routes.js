const routes = require("next-routes");

// .add(name, pattern, page)
// you can leave out parrams if the route and page are the same as the route name
module.exports = routes()
  .add("index", "/")
  .add("dashboard")
  .add("messages")
  .add("notifications")
  .add("calendar")
  .add("admin")
  .add("users", "/users/:id")
  .add("courses", "/courses/:id")
  .add("course-grades", "/courses/:id/grades", "grades")
  .add("course-people", "/courses/:id/people", "course-people")
  .add("login", "/login", "login")
  .add("finishLogin", "/auth/:type")
  .add("courseAdmin", "/courses/:id/admin")
  .add("settings");
