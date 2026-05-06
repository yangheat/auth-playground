import { useState } from "react";
import InfoCard from "./InfoCard";
import LoginCard from "./LoginCard";
import { Button } from "./components/ui/button";
import { Field, FieldLabel } from "./components/ui/field";
import { Checkbox } from "./components/ui/checkbox";
import { toast } from "sonner";
import type { CheckedState } from "@radix-ui/react-checkbox";

function TokenCards() {
  const [token, setToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [httpOnly, setHttpOnly] = useState<CheckedState>(false);

  async function refeshToken() {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/auth/token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setToken(data.accessToken);
    } catch {
      setToken(null);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function login(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    console.log('>>> httpOnly:', httpOnly)
    try {
      const response = await fetch("/api/auth/token/login", {
        method: "POST",
        body: JSON.stringify({ username, password, httpOnly }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error();
      }

      const { accessToken } = await response.json();
      setToken(accessToken);
    } catch {
      setToken(null);
    }
  }

  function logout() {
    setToken(null);
  }

  function copyCookie() {
    const cookies = document.cookie;
    if (cookies) {
      if (httpOnly) {
        toast.error(cookies);
      } else {
        toast.success(cookies);
      }
    } else {
      if (httpOnly) {
        toast.success("cookie를 읽을 수 없음.");
      } else {
        toast.warning("cookie를 읽을 수 없음.");
      }
    }
  }

  return (
    <>
      <InfoCard
        title="Token"
        refresh={refeshToken}
        session={!!token}
        isRefreshing={isRefreshing}
        sessionInfo={{ name: "Token", value: token }}
      >
        <Button onClick={copyCookie}>JS로 쿠키 복사</Button>
      </InfoCard>
      <LoginCard action={login} session={!!token} logout={logout}>
        <Field orientation="horizontal">
          <Checkbox
            id="http-only"
            checked={httpOnly}
            onCheckedChange={setHttpOnly}
            name="http-only"
          />
          <FieldLabel htmlFor="http-only">httpOnly</FieldLabel>
        </Field>
      </LoginCard>
    </>
  );
}

export default TokenCards;
