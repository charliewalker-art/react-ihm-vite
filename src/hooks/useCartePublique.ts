import { useState, useCallback } from 'react';
import axios from 'axios';
import type { Plat } from '../types/plat';
import type { CommandeRequest, CommandeResponse } from '../types/commande';

const API = import.meta.env.VITE_API_BASE_URL;

export const useCartePublique = () => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await axios.get<Plat[]>(`${API}/api/plats/menu`);
      setPlats(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Impossible de charger le menu.');
    }
  }, []);

  const fetchCommandesTable = useCallback(async (tableId: number) => {
    setLoading(true);
    try {
      const statuts = ['EN_ATTENTE_CUISINE', 'EN_PREPARATION', 'PRETE', 'SERVIE', 'EN_ATTENTE_PAIEMENT'];
      const resultats = await Promise.all(
        statuts.map((s) => axios.get<CommandeResponse[]>(`${API}/api/commandes?statut=${s}`))
      );
      const toutes = resultats.flatMap((r) => r.data);
      const deTable = toutes.filter((c) => c.tableId === tableId);
      deTable.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
      setCommandes(deTable);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Récupérer l'id d'une table par son numéro ──
  const fetchTableByNumero = useCallback(async (numeroTable: number): Promise<number | null> => {
    try {
      const res = await axios.get<{ numeroTable: number; id: number }[]>(`${API}/api/tables`);
      const table = res.data.find((t) => t.numeroTable === numeroTable);
      return table ? table.id : null;
    } catch {
      return null;
    }
  }, []);

  const passerCommande = async (data: CommandeRequest): Promise<CommandeResponse> => {
    const res = await axios.post<CommandeResponse>(`${API}/api/commandes`, data);
    return res.data;
  };

  const appellerServeur = async (numeroTable: number): Promise<void> => {
    await axios.patch(`${API}/api/tables/appel/${numeroTable}`);
  };

  return {
    plats,
    commandes,
    loading,
    error,
    fetchMenu,
    fetchCommandesTable,
    fetchTableByNumero,
    passerCommande,
    appellerServeur,
  };
};