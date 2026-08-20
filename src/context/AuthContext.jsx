import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "mentor":
        return "/mentor/dashboard";
      case "student":
        return "/student/dashboard";
      case "user":
      default:
        return "/announcements"; // Standard 'user' role goes to public announcements
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, getRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);