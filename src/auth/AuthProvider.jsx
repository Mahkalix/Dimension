import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { preludeClient } from "./client";
const AuthContext = createContext(null);

export function AuthProvider({ children, client = preludeClient }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(Boolean(client));
  const generation = useRef(0);
  useEffect(() => {
    if (!client) return;
    let active = true;
    let pending = false;
    const restore = async () => {
      if (pending) return;
      pending = true;
      const current = generation.current;
      try {
        const result = await client.refresh();
        if (active && current === generation.current) setUser(result.user);
      } catch {
        if (active && current === generation.current) setUser(null);
      } finally {
        pending = false;
        if (active) setLoading(false);
      }
    };
    restore();
    const timer = setInterval(restore, 60000);
    window.addEventListener("focus", restore);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", restore);
    };
  }, [client]);
  const completeLogin = async (code) => {
    generation.current += 1;
    await client.checkOTP({ code });
    const result = await client.refresh();
    generation.current += 1;
    setUser(result.user);
  };
  const logout = async () => {
    generation.current += 1;
    await client.logout();
    generation.current += 1;
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{
      isAuthenticated: Boolean(user), isLoading, isConfigured: Boolean(client),
      sendCode: (email) => client.startOTP({ identifier: { type: "email_address", value: email } }),
      resendCode: () => client.retryOTP(), completeLogin, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
