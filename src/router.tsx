import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import { useAuth } from "./hooks/useAuth";

// Un mini-composant de sécurité local
const GuardAdmin = () => {
  const { isAuthenticated, getUser } = useAuth();
  const user = getUser();

  // Si pas connecté OU si ce n'est pas le responsable, on redirige vers le login
  if (!isAuthenticated() || user?.role !== "RESPONSABLE_PERSONNEL") {
    return <Navigate to="/" replace />;
  }

  // Sinon, on laisse passer vers la page demandée
  return <Outlet />;
};

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/login", element: <LoginPage /> },
  
  // On protège la route /users ici
  {
    element: <GuardAdmin />,
    children: [
      { path: "/users", element: <UsersPage /> }
    ]
  },

  { path: "/dashboard", element: <div>Dashboard</div> },
]);