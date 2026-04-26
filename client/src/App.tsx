import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Field, FieldGroup, FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";

function App() {
  function action(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input
                  id="usename"
                  name="username"
                  required
                ></Input>
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
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
