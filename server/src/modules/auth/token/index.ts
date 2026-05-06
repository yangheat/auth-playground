import jwt from "@elysia/jwt";
import Elysia, { t } from "elysia";
import { Auth } from "../service";
import { AuthModel } from "../model";

const refreshTokens = new Map<string, { iat: number; exp: number }>();

function storeRefreshToken(token: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  refreshTokens.set(token, { iat: timestamp, exp: timestamp + 2 * 60 });
}

export const token = new Elysia({ prefix: "token" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "1m",
    }),
  )
  .get(
    "/",
    async ({ headers, cookie, status, jwt }) => {
      const accessToken = headers.authorization?.split(" ")[1];
      const profile = await jwt.verify(accessToken);

      // access token이 유효한 경우
      if (profile) {
        return status(200, { accessToken });
      }

      const refreshToken = cookie.refreshToken.value;
      const storedRefreshToken = refreshTokens.get(refreshToken);

      if (!refreshToken || !storedRefreshToken) {
        return status(401, "Unauthorized");
      }

      // refresh token 만료 시간이 지남
      const now = Math.floor(Date.now() / 1000);
      if (now >= storedRefreshToken.exp) {
        return status(401, "Unauthorized");
      }

      // 기존 refresh token 삭제
      refreshTokens.delete(refreshToken);
      // 새로운 refresh token 설정
      const newRefreshToken = crypto.randomUUID();
      storeRefreshToken(newRefreshToken);
      cookie.refreshToken.set({ value: newRefreshToken });

      // accessToken 재발급
      const newAccessToken = await jwt.sign({});
      return status(200, { accessToken: newAccessToken });
    },
    {
      cookie: t.Cookie({
        refreshToken: t.String(),
      }),
    },
  )
  .post(
    "/login",
    async ({ body, cookie, jwt, status }) => {
      const { username, password, httpOnly } = body;
      const result = await Auth.verifyCredentials({ username, password });

      if (!result) {
        return status(401, "Invalid username or password");
      }

      const refreshToken = crypto.randomUUID();
      storeRefreshToken(refreshToken);
      cookie.refreshToken.set({
        value: refreshToken,
        ...(httpOnly === true ? { httpOnly: true } : {}),
      });

      const accessToken = await jwt.sign({});
      return status(200, { accessToken });
    },
    {
      body: t.Intersect([
        AuthModel.credentials,
        t.Object({ httpOnly: t.Optional(t.Boolean()) }),
      ]),
    },
  );
