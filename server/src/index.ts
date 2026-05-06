import { Elysia } from "elysia";
import { session } from "./modules/auth/session";
import { token } from "./modules/auth/token";

// 임시 세션 저장소
const sessions = new Map<
  string,
  { username: string; createAt: number; expiresAt: number }
>();

const app = new Elysia()
  .group("/api/auth", (app) => app.use(session).use(token))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
