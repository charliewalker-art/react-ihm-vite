import { useEffect, useState } from 'react';
import { LayoutGrid, ClipboardList, BookOpen, TrendingUp, Gift, AlertTriangle } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { usePaiement } from '../../hooks/usePaiement';
import { useCommande } from '../../hooks/useCommande';
import { useWebSocket } from '../../hooks/useWebSocket';

// ─── Carte stat ───────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Dashboard Manager ────────────────────────────────────────────────────────

export const DashboardManager = () => {
  const { getStatsDuJour } = usePaiement();
  const { getCommandesEnRetard } = useCommande();

  const [stats, setStats] = useState({ totalEncaisse: 0, totalPourboires: 0 });
  const [retards, setRetards] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const chargerStats = async () => {
    try {
      const [s, r] = await Promise.all([
        getStatsDuJour(),
        getCommandesEnRetard(15),
      ]);
      setStats(s);
      setRetards(r.length);
    } catch {
      // silencieux — stats non critiques
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    chargerStats();
  }, []);

  // Mise à jour temps réel quand une commande change
  useWebSocket(chargerStats);

  return (
    <div className="flex flex-col gap-8">

      {/* Stats du jour */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Aujourd'hui
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Chiffre d'affaires"
            value={loadingStats ? '...' : `${stats.totalEncaisse.toLocaleString('fr-MG')} Ar`}
            icon={<TrendingUp size={20} className="text-green-600 dark:text-green-400" />}
            color="bg-green-100 dark:bg-green-900/30"
            sub="Total encaissé aujourd'hui"
          />
          <StatCard
            label="Pourboires"
            value={loadingStats ? '...' : `${stats.totalPourboires.toLocaleString('fr-MG')} Ar`}
            icon={<Gift size={20} className="text-amber-600 dark:text-amber-400" />}
            color="bg-amber-100 dark:bg-amber-900/30"
            sub="Total pourboires du jour"
          />
          <StatCard
            label="Commandes en retard"
            value={loadingStats ? '...' : `${retards}`}
            icon={<AlertTriangle size={20} className={retards > 0 ? 'text-red-500' : 'text-gray-400'} />}
            color={retards > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}
            sub="En cuisine depuis + de 15 min"
          />
        </div>
      </div>

      {/* Raccourcis navigation */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Navigation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Tables"
            description="Gérer l'état des tables de la salle"
            icon={LayoutGrid}
            color="bg-blue-500"
            route="/tables"
          />
          <DashboardCard
            title="Commandes"
            description="Suivre toutes les commandes en cours"
            icon={ClipboardList}
            color="bg-green-500"
            route="/commandes"
          />
          <DashboardCard
            title="Menu"
            description="Configurer les plats et les prix"
            icon={BookOpen}
            color="bg-purple-500"
            route="/menu"
          />
        </div>
      </div>

    </div>
  );
};