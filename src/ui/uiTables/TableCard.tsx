import { Bell, BellOff, Trash2, QrCode } from "lucide-react";
import type { TableResponse, StatutTable } from "../../types/table";
import { StatutTableBadge } from "./StatutTableBadge";

const statutColors: Record<StatutTable, string> = {
  LIBRE: "border-emerald-200 dark:border-emerald-800",
  OCCUPEE: "border-red-200 dark:border-red-800",
  EN_COURS_DE_NETTOYAGE: "border-yellow-200 dark:border-yellow-800",
  RESERVEE: "border-blue-200 dark:border-blue-800",
};

const nextStatuts: Record<StatutTable, StatutTable[]> = {
  LIBRE: ["OCCUPEE", "RESERVEE"],
  OCCUPEE: ["EN_COURS_DE_NETTOYAGE"],
  EN_COURS_DE_NETTOYAGE: ["LIBRE"],
  RESERVEE: ["LIBRE", "OCCUPEE"],
};

const statutLabels: Record<StatutTable, string> = {
  LIBRE: "Libre",
  OCCUPEE: "Occupée",
  EN_COURS_DE_NETTOYAGE: "Nettoyage",
  RESERVEE: "Réservée",
};

interface TableCardProps {
  table: TableResponse;
  onChangerStatut: (id: number, statut: StatutTable) => void;
  onAcquitter: (id: number) => void;
  onSupprimer: (id: number) => void;
  onVoirQR: (table: TableResponse) => void; // ← nouveau
  isLoading: boolean;
  canDelete: boolean;
}

export const TableCard = ({
  table,
  onChangerStatut,
  onAcquitter,
  onSupprimer,
  onVoirQR, // ← nouveau
  isLoading,
  canDelete,
}: TableCardProps) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border-2 ${statutColors[table.statut]}
                     p-5 flex flex-col gap-4 hover:shadow-md dark:hover:shadow-gray-950/50
                     transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30
                        flex items-center justify-center">
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {table.numeroTable}
          </span>
        </div>
        <div className="flex items-center gap-2">

          {/* Alerte appel serveur */}
          {table.appelServeurActif && (
            <button
              onClick={() => onAcquitter(table.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                         bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400
                         text-xs font-semibold animate-pulse hover:animate-none
                         hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
            >
              <Bell size={14} />
              Appel !
            </button>
          )}

          {/* Bouton QR Code ← nouveau */}
          <button
            onClick={() => onVoirQR(table)}
            className="p-2 rounded-xl text-gray-400 hover:bg-amber-50
                       dark:hover:bg-amber-900/20 hover:text-amber-500
                       dark:hover:text-amber-400 transition-all"
            title="Voir le QR Code"
          >
            <QrCode size={15} />
          </button>

          {/* Supprimer */}
          {canDelete && (
            <button
              onClick={() => onSupprimer(table.id)}
              disabled={isLoading}
              className="p-2 rounded-xl text-gray-400 hover:bg-red-50
                         dark:hover:bg-red-900/20 hover:text-red-500
                         dark:hover:text-red-400 transition-all"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Statut */}
      <div className="flex items-center justify-between">
        <StatutTableBadge statut={table.statut} />
        {table.appelServeurActif ? (
          <Bell size={14} className="text-red-500 animate-pulse" />
        ) : (
          <BellOff size={14} className="text-gray-300 dark:text-gray-600" />
        )}
      </div>

      {/* Actions statut */}
      <div className="flex flex-wrap gap-2">
        {nextStatuts[table.statut].map((s) => (
          <button
            key={s}
            onClick={() => onChangerStatut(table.id, s)}
            disabled={isLoading}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold
                       border border-gray-200 dark:border-gray-700
                       text-gray-600 dark:text-gray-400
                       hover:bg-gray-50 dark:hover:bg-gray-800
                       disabled:opacity-50 transition-all"
          >
            → {statutLabels[s]}
          </button>
        ))}
      </div>
    </div>
  );
};