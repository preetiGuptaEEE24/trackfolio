import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("trackfolio_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("trackfolio_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("trackfolio_token", token);
    else localStorage.removeItem("trackfolio_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("trackfolio_user", JSON.stringify(user));
    else localStorage.removeItem("trackfolio_user");
  }, [user]);

  function login(data) {
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
