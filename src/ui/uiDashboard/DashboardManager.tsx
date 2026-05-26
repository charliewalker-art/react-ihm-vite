import { LayoutGrid, ClipboardList, BookOpen } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardManager = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
);