import axios from "axios";
import type { UtilisateurRequest, UtilisateurResponse } from "../types/utilisateur";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export const useUtilisateur = () => {

  const listerUtilisateurs = async (): Promise<UtilisateurResponse[]> => {
    const response = await axios.get<UtilisateurResponse[]>(
      `${API_URL}/api/utilisateurs`,
      getHeaders()
    );
    return response.data;
  };

  const creerUtilisateur = async (
    data: UtilisateurRequest
  ): Promise<UtilisateurResponse> => {
    const response = await axios.post<UtilisateurResponse>(
      `${API_URL}/api/utilisateurs`,
      data,
      getHeaders()
    );
    return response.data;
  };

  const toggleActif = async (id: number): Promise<UtilisateurResponse> => {
    const response = await axios.patch<UtilisateurResponse>(
      `${API_URL}/api/utilisateurs/${id}/desactiver`,
      {},
      getHeaders()
    );
    return response.data;
  };

  return { listerUtilisateurs, creerUtilisateur, toggleActif };
};