import axios from "axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const useAuth = () => {

  const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/auth/login`,
      data
    );
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const getUser = (): LoginResponse | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const isAuthenticated = (): boolean => {
    return !!getToken();
  };

  return { login, logout, getToken, getUser, isAuthenticated };
};