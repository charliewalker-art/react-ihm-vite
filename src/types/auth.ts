export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
    id: number; 
  token: string;
  username: string;
  role: string;
  nom: string;
  prenom: string;
}

export type Role =
  | "SERVEUR"
  | "CUISINIERE"
  | "CAISSIER"
  | "MANAGER"
  | "RESPONSABLE_PERSONNEL";