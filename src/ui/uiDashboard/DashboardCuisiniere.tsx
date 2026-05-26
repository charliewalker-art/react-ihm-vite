import { ChefHat } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardCuisiniere = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <DashboardCard
      title="File d'attente cuisine"
      description="Voir et gérer les commandes en attente de préparation"
      icon={ChefHat}
      color="bg-orange-500"
      route="/cuisine"
    />
  </div>
);