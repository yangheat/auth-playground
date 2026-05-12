import { useCallback, useState } from "react";
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

const COKKIE_OPTION_BADGE_STYLES: Record<string, string> = {
  httpOnly:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  secure:
    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  sameSite:
    "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
}

function SessionContent() {
  const [session, setSession] = useState(false);
  const [httpOnly, setHttpOnly] = useState<CheckedState>(false);
  const [secure, setSecure] = useState<CheckedState>(false);
  const [sameSite, setSameSite] = useState("lax");
  const [cookieOptions, setCookieOptions] = useState<Record<string, string>>({});

  const refreshSession = useCallback(async () => {
    const response = await fetch("/api/auth/session");
    try {
      if (!response.ok) {
        throw new Error();
      }
      setSession(true);
    } catch {
      setSession(false);
    }
  }, []);

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

    const { cookieOptions } = await response.json();
    setCookieOptions({
      httpOnly: `HttpOnly: ${cookieOptions.httpOnly ? 'O' : 'X'}`,
      scure: `Scure: ${cookieOptions.sucre ? 'O': 'X'}`,
      sameSite: `SameSite: ${cookieOptions.sameSite}`,
    });
    refreshSession();
  }

  const logout = useCallback(() => {
    fetch("/api/auth/session/logout", {
      method: "DELETE",
    }).then(refreshSession);
  }, []);

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
                  defaultValue={sameSite}
                  onValueChange={setSameSite}
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
            <Button><a href="https://developer.mozilla.org/ko/">test</a></Button>
              <form method="POST" action="https://developer.mozilla.org/ko/api/auth/session/test">
        <button type="submit">Cross-site POST form</button>
      </form>
          </CardContent>
        </Card>

        <Card className="">
          {/* <CardHeader>
            <CardTitle>현재 상태</CardTitle>
          </CardHeader> */}
          <CardContent>test</CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>현재 상태</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {Object.entries(cookieOptions)
              .filter(([, enabled]) => enabled)
              .map(([name, value]) => (
                <Badge key={name} className={COKKIE_OPTION_BADGE_STYLES[name]}>{value}</Badge>
              ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default SessionContent;
