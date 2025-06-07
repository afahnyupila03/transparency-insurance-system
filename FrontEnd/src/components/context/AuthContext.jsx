import React, { createContext, useContext, useState, useEffect } from "react";

const API_BASE = "http://localhost:3000"; // <-- Your backend base URL

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        });
    } else {
      setUser(null);
    }
  }, [token]);

const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Server error: Invalid JSON response");
  }
  if (!res.ok) throw new Error(data.message || "LogIn failed");
  setToken(data.token);
  localStorage.setItem("token", data.token);
};

const register = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  let data;
  try {
    data = await res.json();
    console.log(data);
  } catch (e) {
    throw new Error("Server error: Invalid JSON response");
  }
  if (!res.ok) throw new Error(data.message || "Registration failed");
  setToken(data.token);
  localStorage.setItem("token", data.token);
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}