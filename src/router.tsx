import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./pages/UsersPage";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
    <h1 className="text-6xl font-bold text-amber-500">404</h1>
    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
      Page introuvable
    </p>
    
    <a
      href="/login"
      className="mt-6 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all duration-200"
    >
      Retour au login
    </a>
  </div>
);

const ComingSoon = ({ title }: { title: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
    <h1 className="text-3xl font-bold text-amber-500">{title}</h1>
    <p className="mt-2 text-gray-500 dark:text-gray-400">Page en cours de développement</p>
    <a href="/login" className="mt-6 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all duration-200">
      Retour
    </a>
  </div>
);

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/login", element: <LoginPage /> },

  // RESPONSABLE_PERSONNEL
{
  path: "/users",
  element: (
    <ProtectedRoute>
      <UsersPage />
    </ProtectedRoute>
  ),
},

  // MANAGER
  {
    path: "/manager",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  // SERVEUR
  {
    path: "/serveur",
    element: (
      <ProtectedRoute>
        <ComingSoon title="Espace Serveur" />
      </ProtectedRoute>
    ),
  },

  // CUISINIERE
  {
    path: "/cuisine",
    element: (
      <ProtectedRoute>
        <ComingSoon title="Écran Cuisine" />
      </ProtectedRoute>
    ),
  },

  // CAISSIER
  {
    path: "/caisse",
    element: (
      <ProtectedRoute>
        <ComingSoon title="Espace Caisse" />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <NotFound /> },
]);