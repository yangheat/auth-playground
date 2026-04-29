import { useCallback } from "react";
import { useState } from "react";
import LoginCard from "./LoginCard";
import InfoCard from "./InfoCard";

function SessionCards() {
  const [session, setSession] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSession = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        setSession(true);
      } else {
        setSession(false);
      }
    } catch {
      setSession(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  function action(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    fetch("/api/auth/session/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(refreshSession);
  }

  function logout() {
    fetch("/api/auth/session/logout", {
      method: "DELETE",
    }).then(refreshSession);
  }

  return (
    <>
      <InfoCard
        title="Session"
        refreshSession={refreshSession}
        session={session}
        isRefreshing={isRefreshing}
        sessionInfo={{ name: "Cookie", value: document.cookie }}
      />
      <LoginCard action={action} session={session} logout={logout} />
    </>
  );
}

export default SessionCards;
