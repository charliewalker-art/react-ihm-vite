import type { StatutTable } from "../../types/table";

const statutConfig: Record<StatutTable, { label: string; className: string; dot: string }> = {
  LIBRE: {
    label: "Libre",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  OCCUPEE: {
    label: "Occupée",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
  EN_COURS_DE_NETTOYAGE: {
    label: "Nettoyage",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
  RESERVEE: {
    label: "Réservée",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-500",
  },
};

export const StatutTableBadge = ({ statut }: { statut: StatutTable }) => {
  const config = statutConfig[statut];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};