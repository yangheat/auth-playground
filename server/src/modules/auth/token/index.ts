import jwt from "@elysia/jwt";
import Elysia from "elysia";
import { Auth } from "../service";
import { AuthModel } from "../model";

export const token = new Elysia({ prefix: "token" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "1m",
    }),
  )
  .get("/", async ({ headers, status, jwt }) => {
		const accessToken = headers.authorization?.split(' ')
		const profile = await jwt.verify(accessToken?.[1])

		if (!profile) {
			return status(401, "Unauthorized");
		}

		return status(200)
	})
  .post(
    "/login",
    async ({ body, jwt, status }) => {
      const result = await Auth.verifyCredentials(body);
      if (!result) {
        return status(401, "Invalid username or password");
      }
      const accessToken = await jwt.sign({ sub: body.username });
      return status(200, { accessToken });
    },
    {
      body: AuthModel.credentials,
    },
  );
