import { useState } from 'react';
import { UtensilsCrossed, Plus, Minus, AlertTriangle, LayoutGrid } from 'lucide-react';
import type { Plat } from '../../types/plat';
import type { LignePanier, Categorie } from './types';
import { CATEGORIES } from './types';

interface CarteMenuProps {
  plats: Plat[];
  panier: LignePanier[];
  categorieActive: Categorie;
  onCategorie: (c: Categorie) => void;
  onAjouter: (plat: Plat) => void;
  onDiminuer: (platId: number) => void;
}

export const CarteMenu = ({
  plats, panier, categorieActive, onCategorie, onAjouter, onDiminuer
}: CarteMenuProps) => {
  // Filtre "Tous" géré localement : on n'a pas besoin de toucher au type Categorie
  // ni au state du parent pour ça, on ignore juste categorieActive quand il est actif.
  const [afficherTous, setAfficherTous] = useState(false);

  const platsFiltres = afficherTous
    ? plats
    : plats.filter((p) => p.categorie === categorieActive);

  const titreSection = afficherTous
    ? 'Tous les plats'
    : CATEGORIES.find((c) => c.value === categorieActive)?.label;

  return (
    <div>
      {/* Filtres catégories */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        <button
          onClick={() => setAfficherTous(true)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
            ${afficherTous
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
          <LayoutGrid size={12} /> Tous
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setAfficherTous(false);
              onCategorie(cat.value);
            }}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
              ${!afficherTous && categorieActive === cat.value
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
             {cat.label}
          </button>
        ))}
      </div>

      {/* Titre catégorie */}
      <div className="px-4 mb-3">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {titreSection}
        </h2>
      </div>

      {/* Liste plats */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {platsFiltres.length === 0 ? (
          <p className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm col-span-2">
            Aucun plat disponible
          </p>
        ) : (
          platsFiltres.map((plat) => {
            const lignePanier = panier.find((l) => l.plat.id === plat.id);
            return (
              <div
                key={plat.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex"
              >
                {/* Image */}
                {plat.imageUrl ? (
                  <img src={plat.imageUrl} alt={plat.nom} className="w-24 h-24 object-cover shrink-0" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <UtensilsCrossed size={24} className="text-gray-300 dark:text-gray-600" />
                  </div>
                )}

                {/* Infos */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{plat.nom}</p>
                    {plat.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {plat.description}
                      </p>
                    )}
                    {plat.allergenes && (
                      <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> {plat.allergenes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-amber-500 dark:text-amber-400 text-sm">
                      {plat.prix.toLocaleString('fr-MG')} Ar
                    </p>
                    {lignePanier ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDiminuer(plat.id)}
                          className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold text-gray-900 dark:text-white w-4 text-center">
                          {lignePanier.quantite}
                        </span>
                        <button
                          onClick={() => onAjouter(plat)}
                          className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white hover:bg-amber-600"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAjouter(plat)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500
                          hover:bg-amber-600 text-white text-xs font-semibold transition-all"
                      >
                        <Plus size={12} /> Ajouter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};