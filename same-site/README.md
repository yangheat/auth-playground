
# SameSite Test Site

## SameSite의 핵심
SameSite는 브라우저가 cross-site 요청에 쿠키를 붙일지 결정하는 옵션이다.

| 테스트 | 요청 방식 | Strict | Lax(기본값) | None | 확인 내용 |
| --- | --- | --- | --- | --- | --- |
| Top-level GET /session | windows.location.href | 쿠키 붙음 | 쿠키 안 붙음 |  | Request Headers > Cookie |
| Cross-site fetch GET /session | fetch(..) | 쿠키 안 붙음 | 쿠키 안 붙음 |  | Request Headers > Cooki 없음 |
| Cross-site DELETE /logout | fetch(..) | 쿠키 안 붙음 | 쿠키 안 붙음 |  | 로그아웃 안 됨 |
| Top-level unsafe GET /logout | window.location.href |  | 쿠키 안 붙음 |  | 로그아웃될 수 있음 |

SameSite=Lax는 Tol-level GET navigation에 쿠키를 허용한다.  
따라서 서버가 GET /logout 처럼 상태 변경을 기능을 제공하면 외부 사이트에서 상태 변경을 할 수 있다.  
안전하게 사용하기 위해서 GET은 조회에만 사용한다.  
만약 GET을 통해 상태 변경을 해야한다면 검증을 추가한다.
