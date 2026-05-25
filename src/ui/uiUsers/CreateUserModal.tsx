import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { Role, UtilisateurRequest } from "../../types/utilisateur";

interface CreateUserModalProps {
  onClose: () => void;
  onSubmit: (data: UtilisateurRequest) => Promise<void>;
}

const roles: Role[] = ["SERVEUR", "CUISINIERE", "CAISSIER", "MANAGER"];

const roleLabels: Record<Role, string> = {
  SERVEUR: "Serveur",
  CUISINIERE: "Cuisinière",
  CAISSIER: "Caissier",
  MANAGER: "Manager",
  RESPONSABLE_PERSONNEL: "Responsable Personnel",
};

export const CreateUserModal = ({ onClose, onSubmit }: CreateUserModalProps) => {
  const [form, setForm] = useState<UtilisateurRequest>({
    username: "",
    password: "",
    nom: "",
    prenom: "",
    role: "SERVEUR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
                      border border-gray-100 dark:border-gray-800
                      w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Nouveau membre
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100
                       dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-3">
            {(["prenom", "nom"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700
                                  dark:text-gray-300 mb-1 capitalize">
                  {field === "prenom" ? "Prénom" : "Nom"}
                </label>
                <input
                  type="text"
                  required
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                             dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                             text-gray-900 dark:text-gray-100 text-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-400
                             transition-all"
                />
              </div>
            ))}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700
                              dark:text-gray-300 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                         dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700
                              dark:text-gray-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                         dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         transition-all"
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700
                              dark:text-gray-300 mb-1">
              Rôle
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                         dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         transition-all"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{roleLabels[r]}</option>
              ))}
            </select>
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 bg-red-50
                          dark:bg-red-900/20 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200
                         dark:border-gray-700 text-gray-600 dark:text-gray-400
                         hover:bg-gray-50 dark:hover:bg-gray-800
                         text-sm font-medium transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
                         dark:bg-amber-600 dark:hover:bg-amber-500
                         text-white text-sm font-semibold
                         disabled:opacity-60 transition-all
                         flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};