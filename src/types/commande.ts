// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export type TypeCommande = 'SUR_PLACE_QR' | 'SUR_PLACE_SERVEUR' | 'A_EMPORTER';

export type StatutCommande =
  | 'CREEE'
  | 'EN_ATTENTE_CUISINE'
  | 'EN_PREPARATION'
  | 'PRETE'
  | 'SERVIE'
  | 'EN_ATTENTE_PAIEMENT'
  | 'PAYEE'
  | 'ANNULEE';

export type ServicePeriode = 'MIDI' | 'SOIR';

export type ModePaiement = 'ESPECES' | 'CARTE' | 'MOBILE_MONEY';

// ─────────────────────────────────────────────
// DETAIL COMMANDE
// ─────────────────────────────────────────────

export interface DetailCommandeRequest {
  platId: number;
  quantite: number;
  noteClient?: string;
}

export interface DetailCommandeResponse {
  id: number;
  platId: number;
  platNom: string;
  platPrix: number;
  quantite: number;
  noteClient?: string;
  sousTotal: number;
}

// ─────────────────────────────────────────────
// COMMANDE
// ─────────────────────────────────────────────

export interface CommandeRequest {
  typeCommande: TypeCommande;
  tableId?: number;
  serveurId?: number;
  nomClientRetrait?: string;
  tempsAttenteEstime?: number;
  details: DetailCommandeRequest[];
}

export interface CommandeResponse {
  id: number;
  typeCommande: TypeCommande;
  statut: StatutCommande;
  servicePeriode: ServicePeriode;
  tableId?: number;
  numeroTable?: number;
  serveurId?: number;
  serveurNomComplet?: string;
  nomClientRetrait?: string;
  dateCreation: string;
  tempsAttenteEstime?: number;
  details: DetailCommandeResponse[];
  montantTotal: number;
  // Bloc annulation
  annuleParNomComplet?: string;
  motifAnnulation?: string;
  dateAnnulation?: string;
  // Bloc évaluation
  noteSatisfaction?: number;
  commentaireClient?: string;
}

// ─────────────────────────────────────────────
// ANNULATION & ÉVALUATION
// ─────────────────────────────────────────────

export interface AnnulationRequest {
  motifAnnulation: string;
}

export interface EvaluationRequest {
  noteSatisfaction: number; // 1 à 5
  commentaireClient?: string;
}

// ─────────────────────────────────────────────
// PAIEMENT
// ─────────────────────────────────────────────

export interface PaiementRequest {
  commandeId: number;
  caissierId: number;
  montantTotal: number;
  pourboire?: number;
  modePaiement: ModePaiement;
}

export interface PaiementResponse {
  id: number;
  commandeId: number;
  caissierNomComplet: string;
  montantTotal: number;
  pourboire: number;
  modePaiement: ModePaiement;
  datePaiement: string;
}