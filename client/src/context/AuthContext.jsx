import axiosInstance from "../api/axios";
import React, { useState, useEffect, createContext , useContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current session user
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/users/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    const responce = await axiosInstance.post("/api/auth/login", credentials);
    // console.log(responce);
    await fetchUser();
  };

  // Logout
  const logout = async () => {
    await axiosInstance.post("/api/auth/logout");
    setUser(null);
  };

useEffect(() => {
  fetchUser();
}, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
  console.log(value);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};