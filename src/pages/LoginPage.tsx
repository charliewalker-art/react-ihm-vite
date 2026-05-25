import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "../ui/uiAuth/LoginForm";
import { ThemeToggle } from "../ui/uiAuth/ThemeToggle";
import { UtensilsCrossed } from "lucide-react";

// Table de correspondance pour la redirection par rôle
const roleRoutes: Record<string, string> = {
  RESPONSABLE_PERSONNEL: "/users",
  MANAGER: "/manager",
  SERVEUR: "/serveur",
  CUISINIERE: "/cuisine",
  CAISSIER: "/caisse",
};

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Applique le thème
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Redirige si déjà connecté (en utilisant le rôle stocké dans le localStorage)
  useEffect(() => {
    if (isAuthenticated()) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        navigate(roleRoutes[user.role] || "/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login({ username, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      
      // Modification ici : Redirection dynamique selon le rôle reçu
      navigate(roleRoutes[response.role] || "/dashboard");
      
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Erreur de connexion. Réessayez.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50
                    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
                    flex items-center justify-center p-4 transition-colors duration-300">

      {/* Toggle thème */}
      <div className="absolute top-4 right-4">
        <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
      </div>

      {/* Carte principale */}
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-amber-500 dark:bg-amber-600 shadow-xl shadow-amber-200
                          dark:shadow-amber-900/40 mb-4">
            <UtensilsCrossed size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            RestaurantApp
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl
                        shadow-gray-200 dark:shadow-gray-950/50
                        border border-gray-100 dark:border-gray-800 p-8">
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-gray-400 dark:text-gray-600">
          Accès réservé au personnel autorisé
        </p>
      </div>
    </div>
  );
};

export default LoginPage;