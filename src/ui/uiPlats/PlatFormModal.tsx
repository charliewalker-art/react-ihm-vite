import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Plat, PlatRequest, Categorie } from '../../types/plat';

interface PlatFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlatRequest, file: File | null) => Promise<void>;
  platToEdit?: Plat | null;
}

export const PlatFormModal: React.FC<PlatFormModalProps> = ({ isOpen, onClose, onSubmit, platToEdit }) => {
  const [formData, setFormData] = useState<PlatRequest>({
    nom: '', description: '', prix: 0, categorie: 'PLAT', allergenes: '', imageUrl: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (platToEdit) {
      setFormData({
        nom: platToEdit.nom, description: platToEdit.description, prix: platToEdit.prix,
        categorie: platToEdit.categorie, allergenes: platToEdit.allergenes, imageUrl: platToEdit.imageUrl
      });
    } else {
      setFormData({ nom: '', description: '', prix: 0, categorie: 'PLAT', allergenes: '', imageUrl: '' });
    }
    setFile(null);
    setError(null);
  }, [platToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData, file);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la sauvegarde du plat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md flex flex-col max-h-[90vh]">
        
        {/* En-tête calqué sur CreateTableModal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {platToEdit ? 'Modifier le plat' : 'Ajouter un plat'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <X size={18} />
          </button>
        </div>
        
        {/* Formulaire avec les styles de champs identiques */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom du plat
            </label>
            <input required type="text" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all" />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix (Ar)
              </label>
              <input required type="number" step="0.01" min={0} value={formData.prix} onChange={e => setFormData({...formData, prix: parseFloat(e.target.value)})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select value={formData.categorie} onChange={e => setFormData({...formData, categorie: e.target.value as Categorie})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all">
                <option value="ENTREE">Entrée</option>
                <option value="PLAT">Plat</option>
                <option value="DESSERT">Dessert</option>
                <option value="BOISSON">Boisson</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all min-h-20" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Allergènes
            </label>
            <input type="text" value={formData.allergenes} onChange={e => setFormData({...formData, allergenes: e.target.value})} placeholder="Ex: Lait, Arachides..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image (Optionnel)
            </label>
            <input type="file" accept="image/jpeg, image/png, image/webp" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-gray-200 dark:file:border-gray-700 file:text-sm file:font-semibold file:bg-amber-50 dark:file:bg-amber-950/20 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-100 dark:hover:file:bg-amber-900/40 transition-all" />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          {/* Section d'actions inférieure */}
          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-all">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 transition-all">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {platToEdit ? 'Confirmer' : 'Créer'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};