export const StatutBadge = ({ actif }: { actif: boolean }) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit
        ${actif
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${actif ? "bg-emerald-500" : "bg-red-500"}`} />
      {actif ? "Actif" : "Désactivé"}
    </span>
  );
};