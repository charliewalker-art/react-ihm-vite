import { X } from 'lucide-react';
import type { Plat } from '../../types/plat';

interface CarteNoteModalProps {
  plat: Plat;
  note: string;
  onNote: (note: string) => void;
  onConfirmer: () => void;
  onFermer: () => void;
}

export const CarteNoteModal = ({ plat, note, onNote, onConfirmer, onFermer }: CarteNoteModalProps) => (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-900 dark:text-white">Note pour {plat.nom}</p>
        <button
          onClick={onFermer}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => onNote(e.target.value)}
        placeholder="Ex: sans oignon, bien cuit, sauce à part..."
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm
          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:border-amber-500 resize-none"
      />
      <button
        onClick={onConfirmer}
        className="mt-3 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
          text-white font-semibold text-sm transition-all"
      >
        Confirmer
      </button>
    </div>
  </div>
);