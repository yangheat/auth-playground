import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

const AUTH_ORIGIN = "https://auth-playground.test:5173";

type TestResult = {
  name: string;
  ok: boolean;
  status: number | "navigation" | "error";
  message: string;
};

async function readResponse(response: Response) {
  const text = await response.text();
  return text || response.statusText || "No response body";
}

function App() {
  const [result, setResult] = useState<TestResult | null>(null);

  function topLevelGet() {
    const url = `${AUTH_ORIGIN}/api/auth/session`;
    window.open(url, "_blank", "noopener,noreferrer");
    setResult({
      name: "Top-level GET /session",
      ok: true,
      status: "navigation",
      message: "새 탭에서 열었습니다. DevTools Network에서 Cookie 헤더를 확인합니다.",
    });
  }

  async function logout() {
    try {
      const response = await fetch(`${AUTH_ORIGIN}/api/auth/session/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      const message = await readResponse(response);

      setResult({
        name: "Cross-site DELETE /logout",
        ok: response.ok,
        status: response.status,
        message,
      });
    } catch (error) {
      setResult({
        name: "Cross-site DELETE /logout",
        ok: false,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async function fetchGet() {
    try {
      const response = await fetch(`${AUTH_ORIGIN}/api/auth/session`, {
        credentials: "include",
      });
      const message = await readResponse(response);

      setResult({
        name: "Cross-site fetch GET /session",
        ok: response.ok,
        status: response.status,
        message,
      });
    } catch (error) {
      setResult({
        name: "Cross-site fetch GET /session",
        ok: false,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  function unsafeLogout() {
    const url = `${AUTH_ORIGIN}/api/auth/session/logout`;
    window.open(url, "_blank", "noopener,noreferrer");
    setResult({
      name: "Top-level unsafe GET /logout",
      ok: true,
      status: "navigation",
      message: "새 탭에서 열었습니다. 인증 앱에서 로그아웃 여부를 확인합니다.",
    });
  }

  return (
    <main className="flex justify-center min-h-dvh items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>SameSite 테스트</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Button onClick={topLevelGet}>Top-level GET /session</Button>
              <Button onClick={unsafeLogout}>
                Top-level unsafe GET /logout
              </Button>
              <Button onClick={fetchGet}>Cross-site fetch GET /session</Button>
              <Button onClick={logout}>Cross-site DELETE /logout</Button>
            </Field>

            <Field>
              <pre className="min-h-24 rounded-md bg-muted px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                <code>
                  {result
                    ? JSON.stringify(result, null, 2)
                    : "아직 실행하지 않았습니다."}
                </code>
              </pre>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
