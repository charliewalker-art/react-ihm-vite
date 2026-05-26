import { LayoutGrid, ClipboardList } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardServeur = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <DashboardCard
      title="Mes tables"
      description="Voir l'état de toutes les tables"
      icon={LayoutGrid}
      color="bg-blue-500"
      route="/tables"
    />
    <DashboardCard
      title="Commandes"
      description="Gérer les commandes des clients"
      icon={ClipboardList}
      color="bg-green-500"
      route="/commandes"
    />
  </div>
);