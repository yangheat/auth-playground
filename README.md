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

Secure 쿠키 테스트와 SameSite=None; 테스트는 HTTPS가 필요하다.
따라서 인증서를 mkcert로 생성한다.

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

### 3. 서버 실행

```bash
cd client
bun install
bun dev
```

### 4. 인증 앱 실행

```bash
cd server
bun install
bun dev
```

접속: https://auth-playground.test:5173

### 5. 외부 사이트 실행

```
cd same-site
bun install
bun dev
```

접속: http://external-test.test:5174

## 테스트 시나리오

### 테스트 계정

```
username: test
password: 1234
```

### HttpOnly

JS에서 쿠키를 읽을 수 없는지 확인

- 개발자 도구 Console에서 쿠키 확인
    ```js
    document.cookie
    ```
-  https://auth-playground.test:5173/ 에서 쿠키 상태 항목 확인
    | 옵션 | 결과 |
    | --- | --- |
    | HttpOnly=false | sessinId 보임 |
    | HttpOnly=true | sessionId 안 보임 |

### Secure

HTTPS에서만 전송되는지 확인
| 조건 | 결과 |
| --- | --- |
| Secure=false | HTTP/HTTPS에서 전송 가능 |
| Secure=true | HTTPS에서만 전송 가능 |

### SameSite

Cross-site 요청에서 쿠키 전송 여부 확인

| 테스트 | Strict | Lax(기본값) | None | 확인 내용 |
| --- | --- | --- | --- | --- |
| Top-level GET /session | 쿠키 붙음 | 쿠키 안 붙음 | 미구현 | Request Headers > Cookie |
| Cross-site fetch GET /session | 쿠키 안 붙음 | 쿠키 안 붙음 | 미구현 | Request Headers > Cookie 없음 |
| Cross-site DELETE /logout | 쿠키 안 붙음 | 쿠키 안 붙음 | 미구현 | 로그아웃 안 됨 |
| Top-level unsafe GET /logout | 쿠키 안 붙음 | 쿠키 붙음 | 미구현 | 로그아웃됨. |

확인 위치 : DevTools > Network > Request Headers > Cookie

SameSite=Lax는 Tol-level GET navigation에 쿠키를 허용한다.  
따라서 서버가 GET /logout 처럼 상태 변경을 기능을 제공하면 외부 사이트에서 상태 변경을 할 수 있다.  
안전하게 사용하기 위해서 GET은 조회에만 사용한다.  
만약 GET을 통해 상태 변경을 해야한다면 검증을 추가한다.