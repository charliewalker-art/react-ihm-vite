import { ShoppingCart, Minus, Plus, Trash2, ChevronRight, Loader2, UtensilsCrossed } from 'lucide-react';
import type { Plat } from '../../types/plat';
import type { LignePanier } from './types';

interface CartePanierProps {
  panier: LignePanier[];
  totalPanier: number;
  commandeEnCours: boolean;
  onAjouter: (plat: Plat) => void;
  onDiminuer: (platId: number) => void;
  onSupprimer: (platId: number) => void;
  onNoteModal: (plat: Plat, note: string) => void;
  onCommander: () => void;
}

export const CartePanier = ({
  panier, totalPanier, commandeEnCours,
  onAjouter, onDiminuer, onSupprimer, onNoteModal, onCommander
}: CartePanierProps) => (
  <div className="px-4 py-4 flex flex-col gap-3 max-w-2xl mx-auto w-full">
    <h2 className="font-bold text-gray-900 dark:text-white text-lg">Mon panier</h2>

    {panier.length === 0 ? (
      <div className="text-center py-16 text-gray-400 dark:text-gray-600">
        <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Panier vide</p>
      </div>
    ) : (
      <>
        {panier.map((ligne) => (
          <div
            key={ligne.plat.id}
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{ligne.plat.nom}</p>
                <p className="text-amber-500 dark:text-amber-400 text-xs mt-0.5">
                  {ligne.plat.prix.toLocaleString('fr-MG')} Ar × {ligne.quantite} ={' '}
                  {(ligne.plat.prix * ligne.quantite).toLocaleString('fr-MG')} Ar
                </p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={() => onDiminuer(ligne.plat.id)}
                  className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-4 text-center">
                  {ligne.quantite}
                </span>
                <button
                  onClick={() => onAjouter(ligne.plat)}
                  className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white hover:bg-amber-600"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={() => onSupprimer(ligne.plat.id)}
                  className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/40 flex items-center justify-center text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 ml-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <button
              onClick={() => onNoteModal(ligne.plat, ligne.note)}
              className="mt-2 text-xs text-gray-400 dark:text-gray-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <ChevronRight size={12} />
              {ligne.note ? `Note : ${ligne.note}` : 'Ajouter une note (sans oignon, bien cuit...)'}
            </button>
          </div>
        ))}

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between">
          <span className="font-bold text-gray-600 dark:text-gray-300">Total</span>
          <span className="font-bold text-amber-500 dark:text-amber-400 text-lg">
            {totalPanier.toLocaleString('fr-MG')} Ar
          </span>
        </div>

        <button
          onClick={onCommander}
          disabled={commandeEnCours}
          className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white
            font-bold text-base transition-all shadow-lg shadow-amber-200 dark:shadow-amber-900/30
            disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {commandeEnCours
            ? <Loader2 size={18} className="animate-spin" />
            : <UtensilsCrossed size={18} />
          }
          Envoyer la commande
        </button>
      </>
    )}
  </div>
);