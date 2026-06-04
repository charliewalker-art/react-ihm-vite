import { ClipboardList, Loader2 } from 'lucide-react';
import type { CommandeResponse } from '../../types/commande';
import { CarteStatutBadge } from './CarteStatutBadge';

interface CarteCommandesProps {
  commandes: CommandeResponse[];
  loading: boolean;
}

export const CarteCommandes = ({ commandes, loading }: CarteCommandesProps) => (
  <div className="px-4 py-4 flex flex-col gap-3 max-w-2xl mx-auto w-full">
    <h2 className="font-bold text-gray-900 dark:text-white text-lg">Mes commandes</h2>

    {loading && (
      <div className="flex justify-center py-10">
        <Loader2 size={28} className="animate-spin text-amber-500" />
      </div>
    )}

    {!loading && commandes.length === 0 && (
      <div className="text-center py-16 text-gray-400 dark:text-gray-600">
        <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune commande en cours</p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {commandes.map((commande) => (
        <div
          key={commande.id}
          className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-gray-500">Commande #{commande.id}</p>
            <CarteStatutBadge statut={commande.statut} />
          </div>
          <div className="px-4 py-3 flex flex-col gap-1.5">
            {commande.details.map((d, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{d.quantite}× {d.platNom}</span>
                <span className="text-amber-500 dark:text-amber-400">
                  {d.sousTotal.toLocaleString('fr-MG')} Ar
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-2 flex justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">Total</span>
              <span className="font-bold text-amber-500 dark:text-amber-400 text-sm">
                {commande.montantTotal.toLocaleString('fr-MG')} Ar
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);