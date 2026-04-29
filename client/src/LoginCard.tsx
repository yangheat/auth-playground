import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Field, FieldGroup } from "./components/ui/field";
import { FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function LoginCard({
  action,
  session,
  logout,
}: {
  action: (formData: FormData) => void;
  session: boolean;
  logout: () => void;
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
