import { useState } from 'react';
import axiosInstance from './axiosInstance';
import type { PaiementRequest, PaiementResponse } from '../types/commande';

export const usePaiement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Encaisser une commande ──
  const encaisser = async (data: PaiementRequest): Promise<PaiementResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post<PaiementResponse>('/api/paiements', data);
      return res.data;
    } catch {
      setError('Erreur lors de l\'encaissement.');
      throw new Error('Erreur encaissement');
    } finally {
      setLoading(false);
    }
  };

  // ── Paiement d'une commande spécifique ──
  const getPaiementParCommande = async (commandeId: number): Promise<PaiementResponse> => {
    const res = await axiosInstance.get<PaiementResponse>(`/api/paiements/commande/${commandeId}`);
    return res.data;
  };

  // ── Paiements du jour ──
  const getPaiementsDuJour = async (): Promise<PaiementResponse[]> => {
    const res = await axiosInstance.get<PaiementResponse[]>('/api/paiements/aujourdhui');
    return res.data;
  };

  // ── Stats du jour (CA + pourboires) ──
  const getStatsDuJour = async (): Promise<{ totalEncaisse: number; totalPourboires: number }> => {
    const res = await axiosInstance.get('/api/paiements/stats');
    return res.data;
  };

  return {
    loading,
    error,
    encaisser,
    getPaiementParCommande,
    getPaiementsDuJour,
    getStatsDuJour,
  };
};