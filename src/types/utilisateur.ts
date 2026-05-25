export type Role =
  | "SERVEUR"
  | "CUISINIERE"
  | "CAISSIER"
  | "MANAGER"
  | "RESPONSABLE_PERSONNEL";

export interface UtilisateurRequest {
  username: string;
  password: string;
  nom: string;
  prenom: string;
  role: Role;
}

export interface UtilisateurResponse {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  role: Role;
  actif: boolean;
}