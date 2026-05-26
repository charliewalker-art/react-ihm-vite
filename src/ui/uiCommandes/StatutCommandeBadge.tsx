import type { StatutCommande } from '../../types/commande';

interface Props {
  statut: StatutCommande;
}

const statutConfig: Record<StatutCommande, { label: string; classes: string; dot: string }> = {
  CREEE: {
    label: 'Créée',
    classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    dot: 'bg-gray-400',
  },
  EN_ATTENTE_CUISINE: {
    label: 'En attente cuisine',
    classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    dot: 'bg-yellow-500 animate-pulse',
  },
  EN_PREPARATION: {
    label: 'En préparation',
    classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    dot: 'bg-orange-500 animate-pulse',
  },
  PRETE: {
    label: 'Prête',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  SERVIE: {
    label: 'Servie',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  EN_ATTENTE_PAIEMENT: {
    label: 'En attente paiement',
    classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    dot: 'bg-purple-500 animate-pulse',
  },
  PAYEE: {
    label: 'Payée',
    classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    dot: 'bg-emerald-600',
  },
  ANNULEE: {
    label: 'Annulée',
    classes: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

export const StatutCommandeBadge = ({ statut }: Props) => {
  const config = statutConfig[statut];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};