import React from 'react';
import type { Plat } from '../../types/plat';
import { Edit, Trash2, Power, AlertTriangle } from 'lucide-react';

interface PlatCardProps {
  plat: Plat;
  onEdit: (plat: Plat) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onPerte: (id: number) => void;
}

export const PlatCard: React.FC<PlatCardProps> = ({ plat, onEdit, onToggle, onDelete, onPerte }) => {
  const isDisponible = plat.disponible;
  
  return (
    <div 
      className={`bg-white dark:bg-gray-900 rounded-2xl border-2 p-5 flex flex-col hover:shadow-md dark:hover:shadow-gray-950/50 transition-all duration-200
        ${isDisponible 
          ? 'border-amber-200 dark:border-amber-900/50' 
          : 'border-red-200 dark:border-red-900/40 opacity-75'
        }`}
    >
      
      {/* En-tête avec Image et Titre */}
      <div className="flex gap-4 mb-4">
        {plat.imageUrl ? (
          <img src={plat.imageUrl} alt={plat.nom} className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
        ) : (
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-900/30 flex items-center justify-center text-amber-500 dark:text-amber-400 text-xs text-center p-1">
            Pas d'image
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800 dark:text-white">{plat.nom}</h3>
            <span className="font-bold text-amber-600 dark:text-amber-400">{plat.prix.toFixed(2)} Ar</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{plat.description}</p>
        </div>
      </div>

      {/* Badges avec le même design que StatutTableBadge */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {/* Catégorie */}
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {plat.categorie}
        </span>
        
        {/* Disponibilité (Style copié sur LIBRE et OCCUPEE) */}
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
          isDisponible 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isDisponible ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {isDisponible ? 'Disponible' : 'Indisponible'}
        </span>

        {/* Pertes (Style copié sur EN_COURS_DE_NETTOYAGE) */}
        {plat.quantitePerdueJour > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle size={12} className="text-yellow-500" />
            Perte: {plat.quantitePerdueJour}
          </span>
        )}
      </div>

      {/* Boutons d'actions inférieurs calqués sur l'esprit de TableCard */}
      <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between gap-2">
        <button 
          onClick={() => onToggle(plat.id)} 
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
            isDisponible 
              ? 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800' 
              : 'bg-amber-500 hover:bg-amber-600 text-white border-transparent'
          }`}
          title="Changer disponibilité"
        >
          <div className="flex items-center justify-center gap-1.5">
            <Power size={13} />
            {isDisponible ? 'Désactiver' : 'Activer'}
          </div>
        </button>
        
        <button onClick={() => onEdit(plat)} className="p-2 rounded-xl text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title="Modifier">
          <Edit size={15} />
        </button>
        
        <button onClick={() => onPerte(plat.id)} className="p-2 rounded-xl text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title="Déclarer une perte">
          <AlertTriangle size={15} />
        </button>
        
        <button onClick={() => onDelete(plat.id)} className="p-2 rounded-xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 transition-all" title="Supprimer">
          <Trash2 size={15} />
        </button>
      </div>

    </div>
  );
};