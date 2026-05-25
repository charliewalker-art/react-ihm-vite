import type { UtilisateurResponse } from "../../types/utilisateur";
import { RoleBadge } from "./RoleBadge";
import { StatutBadge } from "./StatutBadge";
import { Power } from "lucide-react";

interface UserCardProps {
  user: UtilisateurResponse;
  onToggle: (id: number) => void;
  isLoading: boolean;
}

export const UserCard = ({ user, onToggle, isLoading }: UserCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                    rounded-2xl p-5 flex items-center justify-between gap-4
                    hover:shadow-md dark:hover:shadow-gray-950/50
                    transition-all duration-200">
      {/* Avatar + infos */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30
                        flex items-center justify-center text-amber-600 dark:text-amber-400
                        font-bold text-lg shrink-0">
          {user.prenom[0]}{user.nom[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {user.prenom} {user.nom}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            @{user.username}
          </p>
        </div>
      </div>

      {/* Role + statut + action */}
      <div className="flex items-center gap-3 shrink-0">
        <RoleBadge role={user.role} />
        <StatutBadge actif={user.actif} />
        <button
          onClick={() => onToggle(user.id)}
          disabled={isLoading}
          className={`p-2 rounded-xl transition-all duration-200
            ${user.actif
              ? "text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            } disabled:opacity-50`}
          title={user.actif ? "Désactiver" : "Activer"}
        >
          <Power size={17} />
        </button>
      </div>
    </div>
  );
};