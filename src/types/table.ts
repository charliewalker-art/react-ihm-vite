export type StatutTable =
  | "LIBRE"
  | "OCCUPEE"
  | "EN_COURS_DE_NETTOYAGE"
  | "RESERVEE";

export interface TableRequest {
  numeroTable: number;
}

export interface TableResponse {
  id: number;
  numeroTable: number;
  statut: StatutTable;
  qrCodeUrl: string;
  appelServeurActif: boolean;
  heureAppel: string | null;
}