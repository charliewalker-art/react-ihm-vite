import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { TableRequest } from "../../types/table";

interface CreateTableModalProps {
  onClose: () => void;
  onSubmit: (data: TableRequest) => Promise<void>;
}

export const CreateTableModal = ({ onClose, onSubmit }: CreateTableModalProps) => {
  const [numeroTable, setNumeroTable] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ numeroTable });
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
                      w-full max-w-sm p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Nouvelle table
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400
                                               hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700
                              dark:text-gray-300 mb-1">
              Numéro de table
            </label>
            <input
              type="number"
              min={1}
              required
              value={numeroTable}
              onChange={(e) => setNumeroTable(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200
                         dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20
                          px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200
                         dark:border-gray-700 text-gray-600 dark:text-gray-400
                         hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium">
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
                         text-white text-sm font-semibold disabled:opacity-60
                         flex items-center justify-center gap-2 transition-all">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};