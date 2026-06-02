# auth-playground

인증 옵션을 직접 실행하고 확인하는 playground

## 구성

| 폴더 | 역할 |
| --- | --- |
| server | API 서버. 세션/토큰 로그인, 쿠키 발급 |
| client | 인증 테스트 UI. 쿠키 옵션 선택 후 로그인 |
| same-site | 외부 사이트 역할. SameSite/CSRF 테스트 |

## 실행

### 1. 로컬 도메인 설정

SameSite 테스트는 서로 다른 site가 필요하다.
아래 내용을 /etc/hosts에 추가한다.

```
127.0.0.1 auth-playground.test
127.0.0.1 external-test.test
```

### 2. HTTPS 인증서 생성

Secure 옵션과 SameSite=None 테스트는 HTTPS가 필요하다.
따라서 인증서를 mkcert로 프로젝트 루트에 생성한다.

```bash
brew install mkcert
mkcert -install
mkdir -p certs
mkcert \
  -cert-file certs/local-cert.pem \
  -key-file certs/local-key.pem \
  auth-playground.test \
  external-test.test \
  localhost \
  127.0.0.1 \
  ::1
```

### 3. API 서버 실행

```bash
cd server
bun install
bun dev
```

### 4. 인증 앱 실행

```bash
cd client
bun install
bun dev
```

접속: https://auth-playground.test:5173

### 5. 인증 앱 HTTP 실행

Secure 옵션의 HTTP/HTTPS 전송 차이를 비교할 때만 추가로 실행한다.

```bash
cd client
bun dev:http
```

접속: http://auth-playground.test:5175

### 6. 외부 사이트 실행

```bash
cd same-site
bun install
bun dev
```

접속: https://external-test.test:5174

## 테스트 시나리오

### 테스트 계정

```
username: test
password: 1234
```

### HttpOnly

JS에서 쿠키 값 접근 여부를 설정하는 옵션

- 로그인
- DevTools > Application > Cookies > SessionId 확인
- https://auth-playground.test:5173/ 에서 쿠키 상태 카드 확인
  | 옵션 | 결과 |
  | --- | --- |
  | HttpOnly=false | sessionId 보임 |
  | HttpOnly=true | sessionId 안 보임 |

### Secure

HTTP/HTTPS에 따라 JS에서 쿠키 값 접근과 요청에 자동 포함 여부를 설정  
- HTTPS: https://auth-playground.test:5173
- HTTP: http://auth-playground.test:5175

- 로그인 후
  - session 여부를 확인(로그인 상태)
    | 조건 | 결과 |
    | --- | --- |
    | Secure=false | HTTPS와 HTTP 모두 Request Headers > Cookie에 sessionId를 자동 포함하여 로그인 성공 |
    | Secure=true | HTTPS에만 Request Headers > Cookie에 sessionId를 자동 포함하여 로그인 성공. HTTP는 포함하지 않아 실패.  |
  - 쿠키 상태 카드 확인
    | 조건 | 결과 |
    | --- | --- |
    | Secure=false | HTTPS와 HTTP 모두 SessionId 보임 |
    | Secure=true | HTTPS만 SessionId 보임 |

### SameSite

다른 사이트에서 시작된 요청에 쿠키를 포함하여 보낼지 결정하는 옵션

- Strict는 동일 사이트 요청에만 쿠키를 전송
- Lax는 기본값으로 GET TopLevel 이동에만 쿠키 전송을 허용
- None은 반드시 Secure=true 시에만 사용이 가능하며 CORS 허용 시 모든 항목을 허용
  
- 자동 포함 여부
  | 테스트 | 요청 방식 | Strict | Lax(기본값) | None | 확인 내용 |
  | --- | --- | --- | --- | --- | --- |
  | Top-level GET /session | window.open | 안 붙음 | 붙음 | 붙음 | Request Headers > Cookie |
  | Top-level unsafe GET /logout | window.open | 안 붙음 | 붙음 | 붙음 | 로그아웃 여부 |
  | Cross-site fetch GET /session | fetch(..., { credentials: "include" }) | 안 붙음 | 안 붙음 | CORS 허용 + Secure=true 시 붙음 | Request Headers > Cookie |
  | Cross-site DELETE /logout | fetch(..., { method: "DELETE", credentials: "include" }) | 안 붙음 | 안 붙음 | CORS 허용 + Secure=true 시 붙음 | 로그아웃 여부 |