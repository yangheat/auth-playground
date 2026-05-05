import { useState } from "react";
import InfoCard from "./InfoCard";
import LoginCard from "./LoginCard";

function TokenCards() {
  const [token, setToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function refeshToken() {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/auth/token",{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error()
      }

      const data = await response.json()
      setToken(data.accessToken)
    } catch {
      setToken(null)
    } finally {
      setIsRefreshing(false)
    }
  }

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

  function logout() {
    setToken(null)
  }

  return (
    <>
      <InfoCard
        title="Token"
        refresh={refeshToken}
        session={!!token}
        isRefreshing={isRefreshing}
        sessionInfo={{name: 'Token', value: token}}
      />
      <LoginCard action={login} session={!!token} logout={logout} />
    </>
  );
}

export default TokenCards;
