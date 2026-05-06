import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Field, FieldGroup } from "./components/ui/field";
import { FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import type { ReactNode } from "react";

function LoginCard({
  action,
  session,
  logout,
  children
}: {
  action: (formData: FormData) => void;
  session: boolean;
  logout: () => void;
  children: ReactNode
}) {
  return (
    <>
      <Card>
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
                {children}
              </Field>
              <Field>
                {session ? (
                  <Button type="button" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <Button type="submit">Login</Button>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default LoginCard;
