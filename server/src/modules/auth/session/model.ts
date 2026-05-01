import { t, type UnwrapSchema } from "elysia";

export const SessionModel = {
  sessionId: t.Cookie({
    sessionId: t.String()
  })
}

// Typescript type으로 변환
export type SessionModel = {
  [k in keyof typeof SessionModel]: UnwrapSchema<typeof SessionModel[k]>
}