import axiosInstance from "./axiosInstance";
import type { TableRequest, TableResponse, StatutTable } from "../types/table";

export const useTable = () => {

  const listerTables = async (): Promise<TableResponse[]> => {
    const response = await axiosInstance.get("/api/tables");
    return response.data;
  };

  const creerTable = async (data: TableRequest): Promise<TableResponse> => {
    const response = await axiosInstance.post("/api/tables", data);
    return response.data;
  };

  const changerStatut = async (id: number, statut: StatutTable): Promise<TableResponse> => {
    const response = await axiosInstance.patch(`/api/tables/${id}/statut/${statut}`);
    return response.data;
  };

  const acquitterAppel = async (id: number): Promise<TableResponse> => {
    const response = await axiosInstance.patch(`/api/tables/${id}/acquitter`);
    return response.data;
  };

  const supprimerTable = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tables/${id}`);
  };

  return { listerTables, creerTable, changerStatut, acquitterAppel, supprimerTable };
};