import { useState, useCallback } from 'react';
import axiosInstance from './axiosInstance';
import type {
  CommandeRequest,
  CommandeResponse,
  StatutCommande,
  AnnulationRequest,
  EvaluationRequest,
} from '../types/commande';

export const useCommande = () => {
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Lister par statut (ou toutes si pas de filtre) ──
  const fetchCommandes = useCallback(async (statut?: StatutCommande) => {
    setLoading(true);
    setError(null);
    try {
      const url = statut
        ? `/api/commandes?statut=${statut}`
        : '/api/commandes';
      const res = await axiosInstance.get<CommandeResponse[]>(url);
      setCommandes(res.data);
    } catch {
      setError('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Détail d'une commande ──
  const getCommande = async (id: number): Promise<CommandeResponse> => {
    const res = await axiosInstance.get<CommandeResponse>(`/api/commandes/${id}`);
    return res.data;
  };

  // ── Créer une commande ──
  const creerCommande = async (data: CommandeRequest): Promise<CommandeResponse> => {
    const res = await axiosInstance.post<CommandeResponse>('/api/commandes', data);
    return res.data;
  };

  // ── Transitions de statut ──
  const validerCommande = async (id: number): Promise<CommandeResponse> => {
    const res = await axiosInstance.patch<CommandeResponse>(`/api/commandes/${id}/valider`);
    return res.data;
  };

  const commencerPreparation = async (id: number): Promise<CommandeResponse> => {
    const res = await axiosInstance.patch<CommandeResponse>(`/api/commandes/${id}/commencer`);
    return res.data;
  };

  const marquerPrete = async (id: number): Promise<CommandeResponse> => {
    const res = await axiosInstance.patch<CommandeResponse>(`/api/commandes/${id}/prete`);
    return res.data;
  };

  const marquerServie = async (id: number): Promise<CommandeResponse> => {
    const res = await axiosInstance.patch<CommandeResponse>(`/api/commandes/${id}/servie`);
    return res.data;
  };

  const demanderAddition = async (id: number): Promise<CommandeResponse> => {
    const res = await axiosInstance.patch<CommandeResponse>(`/api/commandes/${id}/addition`);
    return res.data;
  };

  // ── Annulation ──
  const annulerCommande = async (
    id: number,
    annuleParId: number,
    data: AnnulationRequest
  ): Promise<CommandeResponse> => {
    const res = await axiosInstance.patch<CommandeResponse>(
      `/api/commandes/${id}/annuler?annuleParId=${annuleParId}`,
      data
    );
    return res.data;
  };

  // ── Évaluation ──
  const evaluerCommande = async (
    id: number,
    data: EvaluationRequest
  ): Promise<CommandeResponse> => {
    const res = await axiosInstance.patch<CommandeResponse>(`/api/commandes/${id}/evaluer`, data);
    return res.data;
  };

  // ── Commandes en retard (cuisine) ──
  const getCommandesEnRetard = async (seuilMinutes = 15): Promise<CommandeResponse[]> => {
    const res = await axiosInstance.get<CommandeResponse[]>(
      `/api/commandes/retard?seuilMinutes=${seuilMinutes}`
    );
    return res.data;
  };

  // ── Journal des annulations (manager) ──
  const getJournalAnnulations = async (): Promise<CommandeResponse[]> => {
    const res = await axiosInstance.get<CommandeResponse[]>('/api/commandes/annulations');
    return res.data;
  };

  return {
    commandes,
    loading,
    error,
    fetchCommandes,
    getCommande,
    creerCommande,
    validerCommande,
    commencerPreparation,
    marquerPrete,
    marquerServie,
    demanderAddition,
    annulerCommande,
    evaluerCommande,
    getCommandesEnRetard,
    getJournalAnnulations,
  };
};