import { useEffect, useState, useCallback } from 'react';
import { ChefHat, RefreshCw, Loader2, Clock, AlertTriangle, Flame, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useCommande } from '../hooks/useCommande';
import { useWebSocket } from '../hooks/useWebSocket';
import type { CommandeResponse } from '../types/commande';

// ─── Badge statut ─────────────────────────────────────────────────────────────

const StatutBadge = ({ statut }: { statut: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    EN_ATTENTE_CUISINE: {
      label: 'En attente',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700',
    },
    EN_PREPARATION: {
      label: 'En préparation',
      className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-700',
    },
  };
  const c = config[statut] ?? { label: statut, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.className}`}>
      {c.label}
    </span>
  );
};

// ─── Minuterie ────────────────────────────────────────────────────────────────

const Minuterie = ({ dateCreation }: { dateCreation: string }) => {
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = Math.floor((Date.now() - new Date(dateCreation).getTime()) / 60000);
      setMinutes(diff);
    };
    calc();
    const interval = setInterval(calc, 30000);
    return () => clearInterval(interval);
  }, [dateCreation]);

  const isLate = minutes >= 15;
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${
      isLate ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
    }`}>
      {isLate ? <AlertTriangle size={12} /> : <Clock size={12} />}
      {minutes} min
    </span>
  );
};

// ─── Carte commande cuisine ───────────────────────────────────────────────────

const CarteCommande = ({
  commande,
  onCommencer,
  onTerminer,
  loadingId,
}: {
  commande: CommandeResponse;
  onCommencer: (id: number) => void;
  onTerminer: (id: number) => void;
  loadingId: number | null;
}) => {
  const isLoading = loadingId === commande.id;
  const isEnAttente = commande.statut === 'EN_ATTENTE_CUISINE';
  const isEnPrep = commande.statut === 'EN_PREPARATION';

  return (
    <div className={`rounded-2xl border bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-sm transition-all
      ${isEnPrep
        ? 'border-orange-300 dark:border-orange-700 shadow-orange-100 dark:shadow-orange-900/20'
        : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between
        ${isEnPrep ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-amber-50 dark:bg-amber-900/10'}`}
      >
        <div className="flex items-center gap-2">
          {isEnPrep
            ? <Flame size={16} className="text-orange-500" />
            : <Clock size={16} className="text-amber-500" />
          }
          <span className="font-bold text-gray-800 dark:text-white text-sm">
            {commande.tableNumero
              ? `Table ${commande.tableNumero}`
              : commande.nomClientRetrait
                ? `À emporter — ${commande.nomClientRetrait}`
                : `Commande #${commande.id}`
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Minuterie dateCreation={commande.dateCreation} />
          <StatutBadge statut={commande.statut} />
        </div>
      </div>

      {/* Détails plats */}
      <div className="px-4 py-3 flex flex-col gap-2 flex-1">
        {commande.details && commande.details.length > 0 ? (
          commande.details.map((detail, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 min-w-6 h-6 flex items-center justify-center
                rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                {detail.quantite}×
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {detail.platNom}
                </span>
                {detail.noteClient && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 italic">
                    ↳ {detail.noteClient}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">Aucun détail disponible</p>
        )}
      </div>

      {/* Action */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        {isEnAttente && (
          <button
            onClick={() => onCommencer(commande.id)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold
              transition-all shadow-sm shadow-amber-200 dark:shadow-amber-900/30
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Flame size={15} />}
            Commencer la préparation
          </button>
        )}
        {isEnPrep && (
          <button
            onClick={() => onTerminer(commande.id)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-green-500 hover:bg-green-600 text-white text-sm font-semibold
              transition-all shadow-sm shadow-green-200 dark:shadow-green-900/30
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Marquer comme prête
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

export default function CuisinePage() {
  const { commencerPreparation, marquerPrete } = useCommande();

  const [enAttente, setEnAttente] = useState<CommandeResponse[]>([]);
  const [enPreparation, setEnPreparation] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { default: axiosInstance } = await import('../hooks/axiosInstance');
      const [resAttente, resPrep] = await Promise.all([
        axiosInstance.get('/api/commandes?statut=EN_ATTENTE_CUISINE'),
        axiosInstance.get('/api/commandes?statut=EN_PREPARATION'),
      ]);
      setEnAttente(resAttente.data);
      setEnPreparation(resPrep.data);
    } catch {
      setError('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  // ← WebSocket remplace le setInterval
  useWebSocket(charger);

  const handleCommencer = async (id: number) => {
    setLoadingId(id);
    try {
      await commencerPreparation(id);
      await charger();
    } finally {
      setLoadingId(null);
    }
  };

  const handleTerminer = async (id: number) => {
    setLoadingId(id);
    try {
      await marquerPrete(id);
      await charger();
    } finally {
      setLoadingId(null);
    }
  };

  const totalCommandes = enAttente.length + enPreparation.length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat size={24} className="text-amber-500" />
              Écran Cuisine
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              {totalCommandes} commande{totalCommandes > 1 ? 's' : ''} en cours
              {enAttente.length > 0 && (
                <span className="ml-2 text-amber-500 font-semibold">
                  · {enAttente.length} en attente
                </span>
              )}
              {enPreparation.length > 0 && (
                <span className="ml-2 text-orange-500 font-semibold">
                  · {enPreparation.length} en préparation
                </span>
              )}
            </p>
          </div>

          <button
            onClick={charger}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200
              dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold
              hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
            rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Chargement initial */}
        {loading && totalCommandes === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        )}

        {/* Vide */}
        {!loading && totalCommandes === 0 && !error && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            Aucune commande en cuisine pour le moment
          </div>
        )}

        {/* Deux colonnes */}
        {totalCommandes > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* En attente */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  En attente cuisine
                </h2>
                <span className="ml-auto text-xs font-bold bg-amber-100 dark:bg-amber-900/40
                  text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                  {enAttente.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {enAttente.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm
                    border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    Aucune commande en attente
                  </div>
                ) : (
                  enAttente.map((c) => (
                    <CarteCommande
                      key={c.id}
                      commande={c}
                      onCommencer={handleCommencer}
                      onTerminer={handleTerminer}
                      loadingId={loadingId}
                    />
                  ))
                )}
              </div>
            </div>

            {/* En préparation */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  En préparation
                </h2>
                <span className="ml-auto text-xs font-bold bg-orange-100 dark:bg-orange-900/40
                  text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                  {enPreparation.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {enPreparation.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm
                    border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    Aucune commande en préparation
                  </div>
                ) : (
                  enPreparation.map((c) => (
                    <CarteCommande
                      key={c.id}
                      commande={c}
                      onCommencer={handleCommencer}
                      onTerminer={handleTerminer}
                      loadingId={loadingId}
                    />
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}