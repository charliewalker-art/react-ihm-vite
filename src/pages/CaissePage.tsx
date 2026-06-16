import { useEffect, useState, useCallback } from 'react';
import { Wallet, Loader2, RefreshCw, CreditCard, Banknote, Smartphone, CheckCircle2, X } from 'lucide-react';
import Layout from '../components/Layout';
import { usePaiement } from '../hooks/usePaiement';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import type { CommandeResponse, ModePaiement } from '../types/commande';

// Importation de l'utilitaire de génération de facture PDF
import { genererFacturePDF } from '../components/factureGenerator';

// ─── Config modes de paiement ─────────────────────────────────────────────────

const MODES_PAIEMENT: { value: ModePaiement; label: string; icon: React.ReactNode }[] = [
  { value: 'ESPECES', label: 'Espèces', icon: <Banknote size={18} /> },
  { value: 'CARTE', label: 'Carte', icon: <CreditCard size={18} /> },
  { value: 'MOBILE_MONEY', label: 'Mobile Money', icon: <Smartphone size={18} /> },
];

// ─── Modal encaissement (Gère un groupe de commandes) ─────────────────────────

const EncaissementModal = ({
  groupeCommandes,
  caissierId,
  onClose,
  onSuccess,
}: {
  groupeCommandes: CommandeResponse[];
  caissierId: number;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { encaisser, loading } = usePaiement();
  const [modePaiement, setModePaiement] = useState<ModePaiement>('ESPECES');
  const [pourboire, setPourboire] = useState<string>('0');
  const [erreur, setErreur] = useState<string | null>(null);

  const montantTotalGroupe = groupeCommandes.reduce((sum, cmd) => sum + cmd.montantTotal, 0);
  const premiereCmd = groupeCommandes[0];

  const handleEncaisser = async () => {
    setErreur(null);
    try {
      // 1. Enregistrement de chaque commande du groupe auprès de l'API
      for (let i = 0; i < groupeCommandes.length; i++) {
        const cmd = groupeCommandes[i];
        await encaisser({
          commandeId: cmd.id,
          caissierId,
          montantTotal: cmd.montantTotal,
          pourboire: i === 0 ? parseFloat(pourboire) || 0 : 0,
          modePaiement,
        });
      }

      // 2. Génération et téléchargement automatique du ticket de caisse PDF
      genererFacturePDF(groupeCommandes, modePaiement, parseFloat(pourboire) || 0);

      // 3. Rafraîchissement de l'état et fermeture
      onSuccess();
      onClose();
    } catch {
      setErreur("Erreur lors de l'encaissement du groupe. Veuillez réessayer.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-amber-500" />
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Encaissement</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Récap commande */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {groupeCommandes.length > 1 ? `${groupeCommandes.length} Commandes` : `Commande #${premiereCmd.id}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
              {premiereCmd.tableNumero 
                ? `Table ${premiereCmd.tableNumero}` 
                : premiereCmd.tableId 
                  ? `Table ${premiereCmd.tableId}` 
                  : premiereCmd.nomClientRetrait 
                    ? `À emporter — ${premiereCmd.nomClientRetrait}` 
                    : `Commande #${premiereCmd.id}`
              }
            </p>
            
            <div className="flex flex-col gap-1 mt-1 max-h-32 overflow-y-auto">
              {groupeCommandes.map(cmd => 
                cmd.details.map((d, i) => (
                  <p key={`${cmd.id}-${i}`} className="text-xs text-gray-500 dark:text-gray-400">
                    {d.quantite}× {d.platNom} — {d.sousTotal.toLocaleString('fr-MG')} Ar
                  </p>
                ))
              )}
            </div>
            
            <div className="border-t border-amber-200 dark:border-amber-700 mt-2 pt-2 flex justify-between">
              <span className="font-bold text-gray-800 dark:text-white text-sm">Total à payer</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                {montantTotalGroupe.toLocaleString('fr-MG')} Ar
              </span>
            </div>
          </div>

          {/* Mode de paiement */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mode de paiement
            </p>
            <div className="grid grid-cols-3 gap-2">
              {MODES_PAIEMENT.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setModePaiement(m.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all
                    ${modePaiement === m.value
                      ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300'
                    }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pourboire */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Pourboire global (Ar)
            </label>
            <input
              type="number"
              min="0"
              value={pourboire}
              onChange={(e) => setPourboire(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="0"
            />
          </div>

          {/* Total avec pourboire */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total encaissé</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {(montantTotalGroupe + (parseFloat(pourboire) || 0)).toLocaleString('fr-MG')} Ar
            </span>
          </div>

          {/* Erreur */}
          {erreur && (
            <p className="text-sm text-red-500 dark:text-red-400">{erreur}</p>
          )}

          {/* Bouton confirmer */}
          <button
            onClick={handleEncaisser}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
              bg-green-500 hover:bg-green-600 text-white font-semibold text-sm
              transition-all shadow-sm shadow-green-200 dark:shadow-green-900/30
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : <CheckCircle2 size={16} />
            }
            Confirmer l'encaissement
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Carte commande caisse (Gère un groupe) ───────────────────────────────────

const CarteGroupeCommande = ({
  groupe,
  onEncaisser,
}: {
  groupe: CommandeResponse[];
  onEncaisser: (groupe: CommandeResponse[]) => void;
}) => {
  const premiereCmd = groupe[0];
  const montantTotalGroupe = groupe.reduce((sum, cmd) => sum + cmd.montantTotal, 0);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700
      bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-sm">

      {/* Header */}
      <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-green-500" />
          <span className="font-bold text-gray-800 dark:text-white text-sm">
            {premiereCmd.tableNumero 
              ? `Table ${premiereCmd.tableNumero}` 
              : premiereCmd.tableId 
                ? `Table ${premiereCmd.tableId}` 
                : premiereCmd.nomClientRetrait 
                  ? `À emporter — ${premiereCmd.nomClientRetrait}` 
                  : `Commande #${premiereCmd.id}`
            }
          </span>
        </div>
        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100
          dark:bg-green-900/40 border border-green-200 dark:border-green-700 px-2.5 py-1 rounded-full">
          {groupe.length > 1 ? `${groupe.length} commandes` : '1 commande'}
        </span>
      </div>

      {/* Détails */}
      <div className="px-4 py-3 flex flex-col gap-1.5 flex-1 max-h-40 overflow-y-auto">
        {groupe.map(cmd => 
          cmd.details.map((d, i) => (
            <div key={`${cmd.id}-${i}`} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {d.quantite}× {d.platNom}
              </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {d.sousTotal.toLocaleString('fr-MG')} Ar
              </span>
            </div>
          ))
        )}
      </div>

      {/* Total + bouton */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">Total global</p>
          <p className="font-bold text-amber-600 dark:text-amber-400 text-lg">
            {montantTotalGroupe.toLocaleString('fr-MG')} Ar
          </p>
        </div>
        <button
          onClick={() => onEncaisser(groupe)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-green-500 hover:bg-green-600 text-white text-sm font-semibold
            transition-all shadow-sm shadow-green-200 dark:shadow-green-900/30"
        >
          <Wallet size={14} />
          Encaisser
        </button>
      </div>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

export default function CaissePage() {
  const { getUser } = useAuth();
  const user = getUser();
  const caissierId = user?.id ?? 0;

  const [commandes, setCommandes] = useState<CommandeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupeAEncaisser, setGroupeAEncaisser] = useState<CommandeResponse[] | null>(null);

  const charger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { default: axiosInstance } = await import('../hooks/axiosInstance');
      const res = await axiosInstance.get('/api/commandes?statut=EN_ATTENTE_PAIEMENT');
      setCommandes(res.data);
    } catch {
      setError('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  useWebSocket(charger);

  // ─── Logique de regroupement basée sur tableId ───
  const commandesGroupees = Object.values(
    commandes.reduce((acc, cmd) => {
      const idTable = cmd.tableId ?? cmd.tableNumero;
      const key = idTable ? `table-${idTable}` : `emporter-${cmd.id}`;
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(cmd);
      return acc;
    }, {} as Record<string, CommandeResponse[]>)
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wallet size={24} className="text-amber-500" />
              Caisse
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              {commandesGroupees.length} groupe{commandesGroupees.length > 1 ? 's' : ''} en attente de paiement
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

        {/* Chargement */}
        {loading && commandes.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        )}

        {/* Vide */}
        {!loading && !error && commandes.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            Aucune commande en attente de paiement
          </div>
        )}

        {/* Grille */}
        {commandesGroupees.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commandesGroupees.map((groupe, index) => (
              <CarteGroupeCommande
                key={index}
                groupe={groupe}
                onEncaisser={setGroupeAEncaisser}
              />
            ))}
          </div>
        )}

        {/* Modal encaissement */}
        {groupeAEncaisser && (
          <EncaissementModal
            groupeCommandes={groupeAEncaisser}
            caissierId={caissierId}
            onClose={() => setGroupeAEncaisser(null)}
            onSuccess={charger}
          />
        )}
      </div>
    </Layout>
  );
}