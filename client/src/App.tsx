import { useCallback, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend } from "./components/ui/field";
import { Input } from "./components/ui/input";
import { RefreshCw } from "lucide-react";

function App() {
  const [session, setSession] = useState(false)

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        setSession(true)
      }
      
    } catch (error) {
      setSession(false) 
    }
  }, [])


  function action(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(refreshSession);
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardAction>
            <Button variant="ghost" size="sm" onClick={refreshSession}>
              <RefreshCw className="size-3.5 animate-spin" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
          <Field>
            <FieldLegend>로그인 상태</FieldLegend>
            <FieldDescription>{session ? "로그인됨" : "로그인되지 않음"}</FieldDescription>
          </Field>
          <Field>
            <FieldLegend>Cookie</FieldLegend>
            <FieldDescription>{document.cookie}</FieldDescription>
          </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input id="usename" name="username" required></Input>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                ></Input>
              </Field>
              <Field>
                {session ? <Button type="button">Logout</Button> : null}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
