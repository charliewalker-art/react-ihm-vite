import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUtilisateur } from "../hooks/useUtilisateur";
import { useAuth } from "../hooks/useAuth";
import type { UtilisateurResponse } from "../types/utilisateur";
import { UserCard } from "../ui/uiUsers/UserCard";
import { CreateUserModal } from "../ui/uiUsers/CreateUserModal";
import { ThemeToggle } from "../ui/uiAuth/ThemeToggle";
import {
  Users, Plus, LogOut, Search, Loader2
} from "lucide-react";

const UsersPage = () => {
  const { listerUtilisateurs, creerUtilisateur, toggleActif } = useUtilisateur();
  const { logout, getUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UtilisateurResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const currentUser = getUser();

  // Thème
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Chargement
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listerUtilisateurs();
      setUsers(data);
    } catch {
      // token expiré → logout
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    setToggleLoadingId(id);
    try {
      const updated = await toggleActif(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleCreate = async (data: any) => {
    const newUser = await creerUtilisateur(data);
    setUsers((prev) => [...prev, newUser]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Filtrage par recherche
  const filtered = users.filter((u) =>
    `${u.nom} ${u.prenom} ${u.username} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const actifCount = users.filter((u) => u.actif).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100
                         dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 dark:bg-amber-600
                            flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-sm">
                Gestion du Personnel
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {currentUser?.prenom} {currentUser?.nom}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100
                         dark:hover:bg-gray-800 transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: users.length, color: "text-gray-900 dark:text-white" },
            { label: "Actifs", value: actifCount, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Inactifs", value: users.length - actifCount, color: "text-red-500 dark:text-red-400" },
          ].map((stat) => (
            <div key={stat.label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 text-center
                         border border-gray-100 dark:border-gray-800">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Barre d'actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2
                                          text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200
                         dark:border-gray-700 bg-white dark:bg-gray-900
                         text-gray-900 dark:text-gray-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         transition-all"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-amber-500 hover:bg-amber-600 dark:bg-amber-600
                       dark:hover:bg-amber-500 text-white text-sm font-semibold
                       transition-all shadow-lg shadow-amber-200 dark:shadow-amber-900/30"
          >
            <Plus size={16} />
            Nouveau
          </button>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onToggle={handleToggle}
                isLoading={toggleLoadingId === user.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};

export default UsersPage;