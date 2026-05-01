import { Elysia } from "elysia";
import { session } from "./modules/auth/session";
import { token } from "./modules/auth/token";

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

const app = new Elysia()
  .group("/api/auth", (app) => app.use(session).use(token))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
