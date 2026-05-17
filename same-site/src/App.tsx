import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

function App() {
  function topLevelGet() {
    window.location.href = "http://auth-playground.test:5173/api/auth/session";
  }

  async function logout() {
    const response = await fetch(
      "http://auth-playground.test:5173/api/auth/session/logout",
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    console.log(response);
  }

  async function fetchGet() {
    await fetch("http://auth-playground.test:5173/api/auth/session", {
      credentials: "include",
    });
  }

  function unsafeLogout() {
    window.location.href =
      "http://auth-playground.test:5173/api/auth/session/logout";
  }

  return (
    <main className="flex justify-center min-h-dvh items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>SameSite 테스트</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Button onClick={topLevelGet}>Top-level GET 테스트</Button>
              <Button onClick={unsafeLogout}>
                Top-level unsafe GET logout
              </Button>
              <Button onClick={fetchGet}>Cross-site fetch GET 테스트</Button>
              <Button onClick={logout}>Cross-site DELETE/POST 테스트</Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
