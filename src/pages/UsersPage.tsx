import { useState, useEffect } from "react";
import { UserPlus, Loader2, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import { UserCard } from "../ui/uiUsers/UserCard";
import { CreateUserModal } from "../ui/uiUsers/CreateUserModal";
import { useUtilisateur } from "../hooks/useUtilisateur";
import type { UtilisateurResponse, UtilisateurRequest } from "../types/utilisateur";

const UsersPage = () => {
  const { listerUtilisateurs, creerUtilisateur, toggleActif } = useUtilisateur();

  const [users, setUsers] = useState<UtilisateurResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await listerUtilisateurs();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      const updated = await toggleActif(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreate = async (data: UtilisateurRequest) => {
    const newUser = await creerUtilisateur(data);
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={24} className="text-amber-500" />
              Gestion du Staff
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              {users.length} membre{users.length > 1 ? "s" : ""} au total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500
                       text-white font-semibold text-sm
                       shadow-lg shadow-amber-200 dark:shadow-amber-900/30
                       transition-all duration-200"
          >
            <UserPlus size={16} />
            Nouveau membre
          </button>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            Aucun membre trouvé
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onToggle={handleToggle}
                isLoading={togglingId === user.id}
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