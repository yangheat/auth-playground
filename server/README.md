## API

공통 베이스: **`/api/auth`**

### 세션 (쿠키)

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/api/auth/session/` | `sessionId` 쿠키로 현재 세션 유효 여부 확인 |
| `POST` | `/api/auth/session/login` | JSON `{ "username", "password" }` 로 로그인. 성공 시 `Set-Cookie: sessionId=…`. |
| `DELETE` | `/api/auth/session/logout` | `sessionId` 쿠키로 세션 삭제 후 쿠키 제거. |

### 토큰 (JWT)

| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/api/auth/token/login` | JSON `{ "username", "password" }` 로 로그인. 성공 시 **`200`** + `{ "accessToken": "<JWT>" }`. |