import { Button } from "./components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Field, FieldGroup, FieldLabel } from "./components/ui/field"
import { Input } from "./components/ui/input"

function App() {

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input id="usename" required placeholder="test"></Input>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input id="password" type="password" placeholder="1234" required></Input>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      </div>
  )
}

export default App
