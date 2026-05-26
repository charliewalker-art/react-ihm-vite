import { useState, useEffect } from "react";
import { Plus, Loader2, LayoutGrid, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import { TableCard } from "../ui/uiTables/TableCard";
import { CreateTableModal } from "../ui/uiTables/CreateTableModal";
import { useTable } from "../hooks/useTable";
import { useAuth } from "../hooks/useAuth";
import type { TableResponse, TableRequest, StatutTable } from "../types/table";

const filtres: { label: string; value: StatutTable | "TOUTES" }[] = [
  { label: "Toutes", value: "TOUTES" },
  { label: "Libres", value: "LIBRE" },
  { label: "Occupées", value: "OCCUPEE" },
  { label: "Nettoyage", value: "EN_COURS_DE_NETTOYAGE" },
  { label: "Réservées", value: "RESERVEE" },
];

const TablesPage = () => {
  const { listerTables, creerTable, changerStatut, acquitterAppel, supprimerTable } = useTable();
  const { getUser } = useAuth();
  const user = getUser();
  const isManager = user?.role === "MANAGER";

  const [tables, setTables] = useState<TableResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtre, setFiltre] = useState<StatutTable | "TOUTES">("TOUTES");

  const fetchTables = async () => {
    try {
      const data = await listerTables();
      setTables(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTables(); }, []);

  const handleChangerStatut = async (id: number, statut: StatutTable) => {
    setLoadingId(id);
    try {
      const updated = await changerStatut(id, statut);
      setTables((prev) => prev.map((t) => t.id === id ? updated : t));
    } finally {
      setLoadingId(null);
    }
  };

  const handleAcquitter = async (id: number) => {
    setLoadingId(id);
    try {
      const updated = await acquitterAppel(id);
      setTables((prev) => prev.map((t) => t.id === id ? updated : t));
    } finally {
      setLoadingId(null);
    }
  };

  const handleSupprimer = async (id: number) => {
    setLoadingId(id);
    try {
      await supprimerTable(id);
      setTables((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreate = async (data: TableRequest) => {
    const newTable = await creerTable(data);
    setTables((prev) => [...prev, newTable]);
  };

  const tablesFiltrees = filtre === "TOUTES"
    ? tables
    : tables.filter((t) => t.statut === filtre);

  const appelsActifs = tables.filter((t) => t.appelServeurActif).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <LayoutGrid size={24} className="text-amber-500" />
              Plan de salle
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              {tables.length} table{tables.length > 1 ? "s" : ""}
              {appelsActifs > 0 && (
                <span className="ml-2 text-red-500 font-semibold animate-pulse">
                  · {appelsActifs} appel{appelsActifs > 1 ? "s" : ""} en cours
                </span>
              )}
            </p>
          </div>

          {isManager && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                         bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm
                         shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all"
            >
              <Plus size={16} />
              Nouvelle table
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {filtres.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltre(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                ${filtre === f.value
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        ) : tablesFiltrees.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            Aucune table trouvée
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tablesFiltrees.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onChangerStatut={handleChangerStatut}
                onAcquitter={handleAcquitter}
                onSupprimer={handleSupprimer}
                isLoading={loadingId === table.id}
                canDelete={isManager}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreateTableModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};

export default TablesPage;