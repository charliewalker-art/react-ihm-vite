import React, { useEffect, useState } from 'react';
import { Plus, Loader2, UtensilsCrossed, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import { PlatCard } from '../ui/uiPlats/PlatCard';
import { PlatFormModal } from '../ui/uiPlats/PlatFormModal';
import { usePlats } from '../hooks/usePlats';
import type { Plat, PlatRequest } from '../types/plat';

// Alignement strict sur les énumérations de ton modèle de données JPA
type FiltrePlat = "TOUTES" | "ENTREE" | "PLAT" | "DESSERT" | "BOISSON" | "RUPTURE";

const filtres: { label: string; value: FiltrePlat }[] = [
  { label: "Tous", value: "TOUTES" },
  { label: "Entrées", value: "ENTREE" },
  { label: "Plats", value: "PLAT" },
  { label: "Desserts", value: "DESSERT" },
  { label: "Boissons", value: "BOISSON" },
  { label: "En Rupture", value: "RUPTURE" },
];

const PlatsPage: React.FC = () => {
  const { plats, loading, fetchPlats, createPlat, updatePlat, toggleDisponible, deletePlat, declarerPerte } = usePlats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platToEdit, setPlatToEdit] = useState<Plat | null>(null);
  const [filtre, setFiltre] = useState<FiltrePlat>("TOUTES");

  useEffect(() => {
    fetchPlats();
  }, [fetchPlats]);

  const handleOpenCreate = () => {
    setPlatToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plat: Plat) => {
    setPlatToEdit(plat);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: PlatRequest, file: File | null) => {
    if (platToEdit) {
      await updatePlat(platToEdit.id, data, file);
    } else {
      await createPlat(data, file);
    }
  };

  const handlePerte = (id: number) => {
    const qty = prompt("Combien de portions perdues ?");
    if (qty && !isNaN(Number(qty))) {
      declarerPerte(id, Number(qty));
    }
  };

  // Logique de filtrage calquée sur TablesPage
  const platsFiltres = plats.filter((p) => {
    if (filtre === "TOUTES") return true;
    if (filtre === "RUPTURE") return !p.disponible;
    return p.categorie === filtre;
  });

  const rupturesActives = plats.filter((p) => !p.disponible).length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed size={24} className="text-amber-500" />
              Gestion du Menu
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              {plats.length} plat{plats.length > 1 ? "s" : ""} au menu
              {rupturesActives > 0 && (
                <span className="ml-2 text-red-500 font-semibold animate-pulse">
                  · {rupturesActives} en rupture
                </span>
              )}
            </p>
          </div>

          <button 
            onClick={handleOpenCreate} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm
                       shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all"
          >
            <Plus size={16} /> 
            Ajouter un plat
          </button>
        </div>

        {/* Filtres de catégorie identiques au Plan de Salle */}
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

        {/* Contenu principal géré avec le composant Loader2 animé */}
        {loading && plats.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        ) : platsFiltres.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            Aucun plat trouvé dans cette catégorie
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {platsFiltres.map((plat) => (
              <PlatCard 
                key={plat.id} 
                plat={plat} 
                onEdit={handleOpenEdit} 
                onToggle={toggleDisponible} 
                onDelete={deletePlat}
                onPerte={handlePerte}
              />
            ))}
          </div>
        )}

        <PlatFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleSubmit} 
          platToEdit={platToEdit} 
        />
        
      </div>
    </Layout>
  );
};

export default PlatsPage;