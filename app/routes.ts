import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  ...prefix("/dashboard", [
    layout("routes/dashboard/layout.tsx", [
      index("routes/dashboard/home.tsx"),
      route("/chats", "routes/dashboard/chat.tsx", [
        route(":id", "routes/dashboard/chat/id.tsx")
      ]),
      route("/messages", "routes/dashboard/messages.tsx", [
        route(":id", "routes/dashboard/message/id.tsx")
      ]),
      route("/me", "routes/dashboard/me.tsx"),
    ])
  ]),
  ...prefix("/devlopments", [
    route("/login", "routes/devlopments/login.tsx"),
    route("/signup", "routes/devlopments/signup.tsx"),
    layout("routes/devlopments/layout.tsx", [
      index("routes/devlopments/home.tsx"),
      route("/orders/:id", "routes/devlopments/order.tsx"),
    ])
  ]),
  ...prefix("/devdashboard", [
    layout("routes/devdashboard/layout.tsx", [
      index("routes/devdashboard/home.tsx"),
      route("/messages", "routes/devdashboard/messages.tsx", [
        route(":id", "routes/devdashboard/message/id.tsx")
      ]),
      route("/me", "routes/devdashboard/me.tsx"),
    ])
  ]),
  ...prefix("/admin", [
    route("/login", "routes/admin/login.tsx"),
    route("/signup", "routes/admin/signup.tsx"),
    layout("routes/admin/layout.tsx", [
      index("routes/admin/home.tsx"),
      route("/users", "routes/admin/users.tsx"),
      route("/projects", "routes/admin/projects.tsx", [
        route(":id", "routes/admin/project/id.tsx"),
      ]),
      route("/pending", "routes/admin/pending.tsx", [
        route(":id", "routes/admin/pending/id.tsx"),
      ]),
      route("/finance", "routes/admin/finance.tsx"),
      route("/me", "routes/admin/me.tsx"),
    ])
  ])
] satisfies RouteConfig;
