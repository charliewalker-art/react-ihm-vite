import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import TablesPage from "./pages/TablesPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilPage from "./pages/ProfilPage";
import PlatsPage from "./pages/PlatsPage";
import CommandesPage from "./pages/CommandesPage";
import CuisinePage from "./pages/Cuisinepage";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
    <h1 className="text-6xl font-bold text-amber-500">404</h1>
    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">Page introuvable</p>
    <a href="/login" className="mt-6 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all duration-200">
      Retour au login
    </a>
  </div>
);

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/login", element: <LoginPage /> },

  // RESPONSABLE_PERSONNEL
  {
    path: "/users",
    element: <ProtectedRoute><UsersPage /></ProtectedRoute>,
  },

  // MANAGER
  {
    path: "/manager",
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: "/tables",
    element: <ProtectedRoute><TablesPage /></ProtectedRoute>,
  },
  {
    path: "/menu",
    element: <ProtectedRoute><PlatsPage /></ProtectedRoute>,
  },

  // COMMANDES — SERVEUR + MANAGER
  {
    path: "/commandes",
    element: <ProtectedRoute><CommandesPage /></ProtectedRoute>,
  },

  // SERVEUR
  {
    path: "/serveur",
    element: <ProtectedRoute><TablesPage /></ProtectedRoute>,
  },

  // CUISINIERE — placeholder pour l'instant
  {
    path: "/cuisine",
      element: <ProtectedRoute><CuisinePage /></ProtectedRoute>,
  },

  // CAISSIER — placeholder pour l'instant
  {
    path: "/caisse",
    element: <ProtectedRoute><div className="min-h-screen flex items-center justify-center text-amber-500 text-2xl font-bold">Caisse — bientôt</div></ProtectedRoute>,
  },

  {
    path: "/profil",
    element: <ProtectedRoute><ProfilPage /></ProtectedRoute>,
  },
  { path: "*", element: <NotFound /> },
]);