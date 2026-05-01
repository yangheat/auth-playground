import { t, UnwrapSchema } from "elysia";

export const AuthModel = {
  credentials: t.Object({
    username: t.String(),
    password: t.String(),
  }),
};

export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
