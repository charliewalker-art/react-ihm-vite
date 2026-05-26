import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, User, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useUtilisateur } from "../hooks/useUtilisateur";
import type { UpdateProfilRequest } from "../types/profil";

const ProfilPage = () => {
  const { getUser } = useAuth();
  const { modifierProfil } = useUtilisateur();
  const navigate = useNavigate();
  const user = getUser();

  const [form, setForm] = useState<UpdateProfilRequest>({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    username: user?.username || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data: UpdateProfilRequest = {
        nom: form.nom,
        prenom: form.prenom,
        username: form.username,
        ...(form.password ? { password: form.password } : {}),
      };

      const updated = await modifierProfil(data);

      // Met à jour le localStorage
      const currentUser = getUser();
      localStorage.setItem("user", JSON.stringify({
        ...currentUser,
        nom: updated.nom,
        prenom: updated.prenom,
        username: updated.username,
      }));

      setSuccess(true);

      // Si username changé → reconnexion obligatoire
      if (form.username !== user?.username || form.password) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 1500);
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "prenom", label: "Prénom", type: "text" },
    { key: "nom", label: "Nom", type: "text" },
    { key: "username", label: "Nom d'utilisateur", type: "text" },
    { key: "password", label: "Nouveau mot de passe", type: "password", placeholder: "Laisser vide pour ne pas changer" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100
                       dark:hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User size={24} className="text-amber-500" />
              Mon profil
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              Modifier vos informations personnelles
            </p>
          </div>
        </div>

        {/* Carte */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100
                        dark:border-gray-800 shadow-sm p-8">

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30
                            flex items-center justify-center text-amber-600
                            dark:text-amber-400 font-bold text-3xl">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700
                                  dark:text-gray-300 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={"placeholder" in field ? field.placeholder : ""}
                  required={field.key !== "password"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                             dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                             text-gray-900 dark:text-gray-100 text-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-400
                             transition-all placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            ))}

            {/* Erreur */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20
                              border border-red-200 dark:border-red-800
                              text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Succès */}
            {success && (
              <div className="px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20
                              border border-emerald-200 dark:border-emerald-800
                              text-emerald-600 dark:text-emerald-400 text-sm">
                {form.username !== user?.username || form.password
                  ? "Profil modifié — reconnexion en cours..."
                  : "Profil mis à jour avec succès !"}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600
                         dark:bg-amber-600 dark:hover:bg-amber-500
                         text-white font-semibold text-sm
                         disabled:opacity-60 transition-all
                         flex items-center justify-center gap-2
                         shadow-lg shadow-amber-200 dark:shadow-amber-900/30"
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <Save size={18} />
              }
              Sauvegarder
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilPage;