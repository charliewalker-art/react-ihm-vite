import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../ui/uiAuth/ThemeToggle";
import { LogOut, UtensilsCrossed } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const roleLabel: Record<string, string> = {
  RESPONSABLE_PERSONNEL: "Responsable Personnel",
  MANAGER: "Manager",
  SERVEUR: "Serveur",
  CUISINIERE: "Cuisinière",
  CAISSIER: "Caissier",
};

const Navbar = () => {
  const { getUser, logout } = useAuth();
  const user = getUser();
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <nav className="w-full px-6 py-4 bg-white dark:bg-gray-900
                    border-b border-gray-100 dark:border-gray-800
                    flex items-center justify-between
                    shadow-sm transition-colors duration-300">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
          <UtensilsCrossed size={18} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-lg">
          RestaurantApp
        </span>
      </div>

      {/* Droite */}
      <div className="flex items-center gap-4">

        {/* Info utilisateur — cliquable → profil */}
        <button
          onClick={() => navigate("/profil")}
          className="hidden sm:flex flex-col items-end hover:opacity-75 transition-opacity"
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.prenom} {user?.nom}
          </span>
          <span className="text-xs text-amber-500 font-medium">
            {roleLabel[user?.role || ""] || user?.role}
          </span>
        </button>

        <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />

        {/* Bouton déconnexion */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl
                     text-gray-500 dark:text-gray-400
                     hover:bg-red-50 dark:hover:bg-red-900/20
                     hover:text-red-500 dark:hover:text-red-400
                     transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;