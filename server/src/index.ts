import { Elysia, t } from "elysia";

const testUser = {
  username: "test",
  password: "1234",
};

const app = new Elysia()
  .group("/api", (app) =>
    app
      .get("/", () => "Hello Elysia")
      .post(
        "/auth/login",
        ({ body, status }) => {
          const { username, password } = body;

          if (
            username !== testUser.username ||
            password !== testUser.password
          ) {
            return status(401, "Invalid username or password");
          }
          return status(200, "Login successful");
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
        },
      ),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
