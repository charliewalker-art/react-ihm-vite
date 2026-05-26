import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const useAuth = () => {

  const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      "/api/auth/login",
      data
    );
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
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