import jwt from "@elysia/jwt";
import { Elysia, t } from "elysia";

// 임시 세션 저장소
const sessions = new Map<
  string,
  { username: string; createAt: number; expiresAt: number }
>();

const testUser = {
  username: "test",
  password:
    "$argon2id$v=19$m=65536,t=2,p=1$292kuacxOTrrlwxQm/rafWt55NKadhQASNiFQsFEFm0$pcZ7A5DCd1C3vuZHgAjBCOikMV5zWdcPZm1aOr1pCXM",
};

function generateSessionId() {
  return crypto.randomUUID();
}

const app = new Elysia()
  .group("/api/auth", (app) =>
    app
      .group("/session", (app) =>
        app
          .get(
            "/",
            ({ cookie, status }) => {
              const sessionId = cookie.sessionId.value;
              const session = sessions.get(sessionId);
              if (!session) {
                // 쿠키에 sessionId 제거
                cookie.sessionId.remove();
                return status(401, "Unauthorized");
              }
              return status(200);
            },
            {
              cookie: t.Cookie({
                sessionId: t.String(),
              }),
            },
          )
          .post(
            "/login",
            ({ body, cookie, status }) => {
              const { username, password } = body;

              if (
                username !== testUser.username ||
                !Bun.password.verify(password, testUser.password)
              ) {
                return status(401, "Invalid username or password");
              }

              const newSessionId = generateSessionId();
              sessions.set(newSessionId, {
                username,
                createAt: Date.now(),
                expiresAt: Date.now() + 60 * 1000,
              });
              cookie.sessionId.set({ value: newSessionId });
              return status(200);
            },
            {
              body: t.Object({
                username: t.String(),
                password: t.String(),
              }),
            },
          )
          .delete(
            "/logout",
            ({ cookie, status }) => {
              const sessionId = cookie.sessionId.value;
              // 세션 저장소에서 세션 제거
              sessions.delete(sessionId);
              // 쿠키에 sessionId 제거
              cookie.sessionId.remove();
              status(200);
            },
            {
              cookie: t.Cookie({
                sessionId: t.String(),
              }),
            },
          ),
      )
      .use(
        jwt({
          name: "jwt",
          secret: "Fischl von Luftschloss Narfidort",
        }),
      )
      .group("/token", (app) =>
        app.post(
          "login",
          async ({ body, status, jwt }) => {
            const { username, password } = body;

            if (
              username !== testUser.username ||
              !Bun.password.verify(password, testUser.password)
            ) {
              return status(401, "Invalid username or password");
            }

            const accessToken = await jwt.sign({
              sub: username,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
            });

            return status(200, {
              accessToken,
            });
          },
          {
            body: t.Object({
              username: t.String(),
              password: t.String(),
            }),
          },
        ),
      ),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
