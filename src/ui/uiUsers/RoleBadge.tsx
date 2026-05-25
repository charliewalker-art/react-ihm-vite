import type { Role } from "../../types/utilisateur";

const roleConfig: Record<Role, { label: string; className: string }> = {
  SERVEUR: {
    label: "Serveur",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  CUISINIERE: {
    label: "Cuisinière",
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  CAISSIER: {
    label: "Caissier",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  MANAGER: {
    label: "Manager",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  RESPONSABLE_PERSONNEL: {
    label: "Responsable",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

export const RoleBadge = ({ role }: { role: Role }) => {
  const config = roleConfig[role];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};