import jwt from "@elysia/jwt";
import Elysia from "elysia";
import { Auth } from "../service";
import { AuthModel } from "../model";

const refreshTokens = new Map<string, { iat: number; exp: number }>();

function createAccessToken() {}

export const token = new Elysia({ prefix: "token" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "1m",
    }),
  )
  .get("/", async ({ headers, status, jwt }) => {
    const accessToken = headers.authorization?.split(" ")[1];
    const profile = await jwt.verify(accessToken);

    if (profile) {
      return status(200);
    }

    const cookies = new URLSearchParams(headers.cookie);
    const refreshToken = cookies.get("refreshToken");

    if (refreshToken) {
      const storedRefreshToken = refreshTokens.get(refreshToken);
      const now = Math.floor(Date.now());

      if (storedRefreshToken && now > storedRefreshToken.exp) {
        const accessToken = await jwt.sign({});
        return status(200, { accessToken });
      }
    }

    return status(401, "Unauthorized");
  })
  .post(
    "/login",
    async ({ body, cookie, jwt, status }) => {
      const result = await Auth.verifyCredentials(body);

      if (!result) {
        return status(401, "Invalid username or password");
      }
      
      const refreshToken = crypto.randomUUID();
      const timestamp = Math.floor(Date.now() / 1000);
      refreshTokens.set(refreshToken, {
        iat: timestamp,
        exp: timestamp + 2,
      });
      cookie.refreshToken.set({ value: refreshToken });

      const accessToken = await jwt.sign({});
      return status(200, { accessToken });
    },
    {
      body: AuthModel.credentials,
    },
  );
