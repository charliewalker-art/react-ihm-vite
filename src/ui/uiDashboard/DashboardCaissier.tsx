import { CreditCard } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardCaissier = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <DashboardCard
      title="Paiements"
      description="Encaisser les commandes en attente de paiement"
      icon={CreditCard}
      color="bg-emerald-500"
      route="/paiements"
    />
  </div>
);