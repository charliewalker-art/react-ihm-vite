import { Users } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardResponsable = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <DashboardCard
      title="Gérer le staff"
      description="Créer, activer ou désactiver les comptes du personnel"
      icon={Users}
      color="bg-amber-500"
      route="/users"
    />
  </div>
);