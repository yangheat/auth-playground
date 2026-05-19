import Elysia, { t } from "elysia";
import { SessionModel } from "./model";
import { AuthModel } from "../model";
import { Auth } from "../service";

const sessions = new Map<
  string,
  {
    username: string;
    createAt: number;
    expiresAt: number;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: "none" | "strict" | "lax";
    };
  }
>();

export const session = new Elysia({ prefix: "session" })
  .get(
    "/",
    ({ cookie, status }) => {
      const sessionId = cookie.sessionId.value;
      if (!sessionId) {
        return status(401, "Unauthorized");
      }

      const session = sessions.get(sessionId);
      if (!session) {
        // 쿠키에 sessionId 제거
        cookie.sessionId.remove();
        return status(401, "Unauthorized");
      }
      return status(200, { cookieOptions: session.cookieOptions });
    },
    {
      cookie: SessionModel.sessionId,
    },
  )
  .post(
    "/login",
    async ({ body, cookie, status }) => {
      const { username, password, httpOnly, secure, sameSite } = body;
      const result = await Auth.verifyCredentials({ username, password });

      if (!result) {
        return status(401, "Invalid username or password");
      }

      const sessionId = crypto.randomUUID();
      const cookieOptions = { httpOnly, secure, sameSite };
      const profile = {
        username,
        createAt: Date.now(),
        expiresAt: Date.now() + 60 * 1000,
        cookieOptions,
      };

      sessions.set(sessionId, profile);
      cookie.sessionId.set({ value: sessionId, ...cookieOptions });
      return status(200);
    },
    {
      body: t.Intersect([AuthModel.credentials, AuthModel.cookieOptions]),
    },
  )
  .get(
    "/logout",
    ({ cookie, status }) => {
      const sessionId = cookie.sessionId.value;
      if (!sessionId) {
        return status(200);
      }

      // 세션 저장소에서 세션 제거
      sessions.delete(sessionId);
      // 쿠키에 sessionId 제거
      cookie.sessionId.remove();
      status(200);
    },
    {
      cookie: SessionModel.sessionId,
    },
  )
  .delete(
    "/logout",
    ({ cookie, status }) => {
      const sessionId = cookie.sessionId.value;
      if (!sessionId) {
        return status(200);
      }

      // 세션 저장소에서 세션 제거
      sessions.delete(sessionId);
      // 쿠키에 sessionId 제거
      cookie.sessionId.remove();
      status(200);
    },
    {
      cookie: SessionModel.sessionId,
    },
  );
