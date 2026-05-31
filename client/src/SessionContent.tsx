import { useCallback, useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./components/ui/field";
import { Input } from "./components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "./components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Badge } from "./components/ui/badge";

import type { CheckedState } from "@radix-ui/react-checkbox";

type SameSite = "strict" | "lax" | "none";

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: SameSite;
};

type SessionApiResult =
  | { ok: true; status: number; body: { cookieOptions: CookieOptions } }
  | { ok: false; status: number; message: string };

const COOKIE_OPTION_BADGE_STYLES: Record<keyof CookieOptions, string> = {
  httpOnly:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  secure: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  sameSite:
    "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};

async function requestSession(): Promise<SessionApiResult> {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      const message = (await response.text()) || response.statusText;
      return { ok: false, status: response.status, message };
    }

    const body = (await response.json()) as { cookieOptions: CookieOptions };
    return { ok: true, status: response.status, body };
  } catch {
    return { ok: false, status: 0, message: "Network error" };
  }
}

function SessionContent() {
  const [session, setSession] = useState(false);
  const [httpOnly, setHttpOnly] = useState<CheckedState>(false);
  const [secure, setSecure] = useState<CheckedState>(false);
  const [sameSite, setSameSite] = useState<SameSite>("lax");
  const [cookieOptions, setCookieOptions] = useState<CookieOptions | null>(
    null,
  );
  const [apiTestResult, setApiTestResult] = useState("");

  const applySessionResult = useCallback((result: SessionApiResult) => {
    if (result.ok) {
      setCookieOptions(result.body.cookieOptions);
      setSession(true);
      return;
    }

    setCookieOptions(null);
    setSession(false);
  }, []);

  const refreshSession = useCallback(
    async ({ updateApiTestResult = false } = {}) => {
      const result = await requestSession();
      applySessionResult(result);

      if (updateApiTestResult) {
        setApiTestResult(JSON.stringify(result, null, 2));
      }

      return result;
    },
    [applySessionResult],
  );

  async function login(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch("/api/auth/session/login", {
      method: "POST",
      body: JSON.stringify({ username, password, httpOnly, secure, sameSite }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("로그인에 실패했습니다.");
      return;
    }

    await refreshSession({ updateApiTestResult: true });
  }

  const logout = useCallback(async () => {
    await fetch("/api/auth/session/logout", {
      method: "DELETE",
    });

    await refreshSession({ updateApiTestResult: true });
  }, [refreshSession]);

  async function executeSessionApi() {
    await refreshSession({ updateApiTestResult: true });
  }

  function changeSameSite(value: string) {
    if (!value) {
      return;
    }

    setSameSite(value as SameSite);
  }

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  return (
    <main className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2">
      <Card className="">
        <CardHeader>
          <CardTitle>쿠키 옵션</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="http-only"
                    checked={httpOnly}
                    onCheckedChange={setHttpOnly}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="http-only">HttpOnly</FieldLabel>
                    <FieldDescription>
                      JavaScript에서 쿠키를 읽을 수 없도록 설정합니다.
                    </FieldDescription>
                  </FieldContent>
                </Field>

                <Field orientation="horizontal">
                  <Checkbox
                    id="secure"
                    checked={secure}
                    onCheckedChange={setSecure}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="secure">secure</FieldLabel>
                    <FieldDescription>
                      HTTPS 연결에서만 쿠키가 전송됩니다.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>SameSite</FieldLegend>
              <FieldGroup>
                <ToggleGroup
                  type="single"
                  value={sameSite}
                  onValueChange={changeSameSite}
                  className="w-full"
                >
                  <ToggleGroupItem value="strict" className="flex-1">
                    strict
                  </ToggleGroupItem>
                  <ToggleGroupItem value="lax" className="flex-1">
                    lax
                  </ToggleGroupItem>
                  <ToggleGroupItem value="none" className="flex-1">
                    none
                  </ToggleGroupItem>
                </ToggleGroup>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldLegend>로그인 정보</FieldLegend>
              {!session ? (
                <form action={login}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="username">username</FieldLabel>
                      <Input id="username" name="username"></Input>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="password">password</FieldLabel>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                      ></Input>
                    </Field>

                    <Field>
                      <Button type="submit">Login</Button>
                    </Field>
                  </FieldGroup>
                </form>
              ) : (
                <Field>
                  <Button type="button" onClick={logout}>
                    Logout
                  </Button>
                </Field>
              )}
            </FieldSet>
          </FieldGroup>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <Card className="">
          <CardHeader>
            <CardTitle>쿠키 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="min-h-12 rounded-md bg-muted px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
              <code>document.cookie = {document.cookie}</code>
            </pre>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>API 테스트</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Button onClick={executeSessionApi}>GET /auth/session</Button>
              <pre className="min-h-12 rounded-md bg-muted px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                <code>{apiTestResult || "아직 실행하지 않았습니다."}</code>
              </pre>
            </FieldGroup>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>현재 상태</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {cookieOptions ? (
              <>
                <Badge className={COOKIE_OPTION_BADGE_STYLES.httpOnly}>
                  HttpOnly: {cookieOptions.httpOnly ? "O" : "X"}
                </Badge>
                <Badge className={COOKIE_OPTION_BADGE_STYLES.secure}>
                  Secure: {cookieOptions.secure ? "O" : "X"}
                </Badge>
                <Badge className={COOKIE_OPTION_BADGE_STYLES.sameSite}>
                  SameSite: {cookieOptions.sameSite}
                </Badge>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                세션 쿠키 없음
              </span>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default SessionContent;
