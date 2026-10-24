import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Start in "loading" only if there is a token to verify
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );

  // On first load, ask the API who the token belongs to
  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    api("/user")
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api("/login", {
      method: "POST",
      body: { email, password },
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function register(fields) {
    const data = await api("/register", {
      method: "POST",
      body: fields,
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function logout() {
    try {
      await api("/logout", {
        method: "POST",
      });
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
