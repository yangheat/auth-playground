import { t, UnwrapSchema } from "elysia";

export const AuthModel = {
  credentials: t.Object({
    username: t.String(),
    password: t.String(),
  }),

  cookieOptions: t.Object({
    httpOnly: t.Boolean(),
    secure: t.Boolean(),
    sameSite: t.Union([
      t.Literal("strict"),
      t.Literal("lax"),
      t.Literal("none"),
    ]),
  }),
};

export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
