import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface AnnulationModalProps {
  commandeId: number;
  onClose: () => void;
  onConfirm: (commandeId: number, motif: string) => Promise<void>;
}

export const AnnulationModal = ({ commandeId, onClose, onConfirm }: AnnulationModalProps) => {
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!motif.trim()) {
      setError('Le motif est obligatoire.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onConfirm(commandeId, motif.trim());
      onClose();
    } catch {
      setError("Erreur lors de l'annulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm p-6 space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h2 className="text-base font-bold">Annuler la commande #{commandeId}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cette action est irréversible. Merci d'indiquer un motif d'annulation.
        </p>

        <textarea
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          placeholder="Ex: Client a changé d'avis, plat non disponible..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        {error && (
          <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-50
              dark:hover:bg-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !motif.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};