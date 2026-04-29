import { useState } from "react";
import InfoCard from "./InfoCard";
import LoginCard from "./LoginCard";

function TokenCards() {
  const [token, setToken] = useState<string | null>(null);

  async function login(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/token/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (!response.ok) {
        throw new Error()
      }
  
      const { accessToken } = await response.json();
      setToken(accessToken);
    } catch {
      setToken(null);
    }
  }

  return (
    <>
      <InfoCard
        title="Token"
        refreshSession={() => {}}
        session={!!token}
        isRefreshing={false}
        sessionInfo={{name: 'Token', value: token}}
      />
      <LoginCard action={login} session={!!token} logout={() => {}} />
    </>
  );
}

export default TokenCards;
