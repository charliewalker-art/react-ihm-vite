import { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw, Loader2, ClipboardList } from 'lucide-react';
import Layout from '../components/Layout';
import { useCommande } from '../hooks/useCommande';
import { usePlats } from '../hooks/usePlats';
import { useTable } from '../hooks/useTable';
import { useAuth } from '../hooks/useAuth';
import { CommandeCard } from '../ui/uiCommandes/CommandeCard';
import { CreateCommandeModal } from '../ui/uiCommandes/CreateCommandeModal';
import { AnnulationModal } from '../ui/uiCommandes/AnnulationModal';
import type { StatutCommande, CommandeRequest } from '../types/commande';
import type { TableResponse } from '../types/table';


// Filtres disponibles dans la page serveur/manager
const FILTRES: { label: string; value: StatutCommande | 'TOUTES' }[] = [
  { label: 'Toutes', value: 'TOUTES' },
  { label: 'Créées', value: 'CREEE' },
  { label: 'En attente cuisine', value: 'EN_ATTENTE_CUISINE' },
  { label: 'En préparation', value: 'EN_PREPARATION' },
  { label: 'Prêtes', value: 'PRETE' },
  { label: 'Servies', value: 'SERVIE' },
  { label: 'Attente paiement', value: 'EN_ATTENTE_PAIEMENT' },
];

export default function CommandesPage() {
  const { commandes, loading, error, fetchCommandes, creerCommande,
    validerCommande, marquerServie, demanderAddition, annulerCommande } = useCommande();
  const { plats, fetchPlats } = usePlats();
  const { listerTables } = useTable();
  const { getUser } = useAuth();

  const user = getUser();
  const userRole = user?.role ?? '';
  const userId = user ? (JSON.parse(localStorage.getItem('user') ?? '{}')?.id ?? 0) : 0;

  const [filtre, setFiltre] = useState<StatutCommande | 'TOUTES'>('TOUTES');
  const [tables, setTables] = useState<TableResponse[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [annulationCommandeId, setAnnulationCommandeId] = useState<number | null>(null);

  const charger = useCallback(() => {
    if (filtre === 'TOUTES') {
      fetchCommandes();
    } else {
      fetchCommandes(filtre);
    }
  }, [filtre, fetchCommandes]);

  useEffect(() => {
    charger();
    fetchPlats();
    listerTables().then(setTables).catch(() => {});
  }, [charger]);

  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(charger, 30000);
    return () => clearInterval(interval);
  }, [charger]);

  const handleCreer = async (data: CommandeRequest) => {
    await creerCommande(data);
    charger();
  };

  const handleValider = async (id: number) => {
    await validerCommande(id);
    charger();
  };

  const handleMarquerServie = async (id: number) => {
    await marquerServie(id);
    charger();
  };

  const handleDemanderAddition = async (id: number) => {
    await demanderAddition(id);
    charger();
  };

  const handleAnnuler = async (commandeId: number, motif: string) => {
    await annulerCommande(commandeId, userId, { motifAnnulation: motif });
    charger();
  };

  // Trier : plus récentes en premier pour les statuts actifs
  const commandesTriees = [...commandes].sort(
    (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ClipboardList size={24} className="text-amber-500" />
              Commandes
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              {commandes.length} commande{commandes.length > 1 ? 's' : ''} affichée{commandes.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
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

            {(userRole === 'SERVEUR' || userRole === 'MANAGER') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm
                  shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all"
              >
                <Plus size={16} />
                Nouvelle commande
              </button>
            )}
          </div>
        </div>

        {/* Filtres par statut */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTRES.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltre(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                ${filtre === f.value
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* États de chargement / erreur / vide */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
            rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && commandes.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            Aucune commande pour ce filtre
          </div>
        )}

        {/* Grille des commandes */}
        {!loading && !error && commandesTriees.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {commandesTriees.map((commande) => (
              <CommandeCard
                key={commande.id}
                commande={commande}
                userRole={userRole}
                userId={userId}
                onValider={handleValider}
                onMarquerServie={handleMarquerServie}
                onDemanderAddition={handleDemanderAddition}
                onAnnuler={(id) => setAnnulationCommandeId(id)}
              />
            ))}
          </div>
        )}

        {/* Modal création */}
        {showCreateModal && (
          <CreateCommandeModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreer}
            plats={plats}
            tables={tables}
            serveurId={userId}
          />
        )}

        {/* Modal annulation */}
        {annulationCommandeId !== null && (
          <AnnulationModal
            commandeId={annulationCommandeId}
            onClose={() => setAnnulationCommandeId(null)}
            onConfirm={handleAnnuler}
          />
        )}
      </div>
    </Layout>
  );
}