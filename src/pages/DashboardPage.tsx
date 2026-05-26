import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { DashboardResponsable } from "../ui/uiDashboard/DashboardResponsable";
import { DashboardManager } from "../ui/uiDashboard/DashboardManager";
import { DashboardServeur } from "../ui/uiDashboard/DashboardServeur";
import { DashboardCuisiniere } from "../ui/uiDashboard/DashboardCuisiniere";
import { DashboardCaissier } from "../ui/uiDashboard/DashboardCaissier";

const roleLabel: Record<string, string> = {
  RESPONSABLE_PERSONNEL: "Responsable Personnel",
  MANAGER: "Manager",
  SERVEUR: "Serveur",
  CUISINIERE: "Cuisinière",
  CAISSIER: "Caissier",
};

const DashboardPage = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const role = user?.role || "";

  const renderDashboard = () => {
    switch (role) {
      case "RESPONSABLE_PERSONNEL": return <DashboardResponsable />;
      case "MANAGER": return <DashboardManager />;
      case "SERVEUR": return <DashboardServeur />;
      case "CUISINIERE": return <DashboardCuisiniere />;
      case "CAISSIER": return <DashboardCaissier />;
      default: return <p className="text-gray-500 dark:text-gray-400">Rôle non reconnu.</p>;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Salutation */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bonjour, {user?.prenom} 👋
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Vous êtes connecté en tant que{" "}
            <span className="text-amber-500 font-medium">
              {roleLabel[role] || role}
            </span>
          </p>
        </div>

        {/* Dashboard selon rôle */}
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default DashboardPage;