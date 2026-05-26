import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, MapPin, Loader2 } from 'lucide-react';
import type  { CommandeRequest, DetailCommandeRequest, TypeCommande } from '../../types/commande';
import type { Plat } from '../../types/plat';
import type { TableResponse } from '../../types/table';

interface CreateCommandeModalProps {
  onClose: () => void;
  onSubmit: (data: CommandeRequest) => Promise<void>;
  plats: Plat[];
  tables: TableResponse[];
  serveurId: number;
}

export const CreateCommandeModal = ({
  onClose,
  onSubmit,
  plats,
  tables,
  serveurId,
}: CreateCommandeModalProps) => {
  const [typeCommande, setTypeCommande] = useState<TypeCommande>('SUR_PLACE_SERVEUR');
  const [tableId, setTableId] = useState<number | undefined>();
  const [nomClientRetrait, setNomClientRetrait] = useState('');
  const [panier, setPanier] = useState<Map<number, DetailCommandeRequest>>(new Map());
  const [notes, setNotes] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableslibres = tables.filter((t) => t.statut === 'LIBRE' || t.statut === 'OCCUPEE');
  const platsDisponibles = plats.filter((p) => p.disponible);

  const ajouterPlat = (plat: Plat) => {
    setPanier((prev) => {
      const next = new Map(prev);
      const existing = next.get(plat.id);
      next.set(plat.id, {
        platId: plat.id,
        quantite: existing ? existing.quantite + 1 : 1,
        noteClient: notes.get(plat.id) ?? '',
      });
      return next;
    });
  };

  const retirerPlat = (platId: number) => {
    setPanier((prev) => {
      const next = new Map(prev);
      const existing = next.get(platId);
      if (!existing) return next;
      if (existing.quantite <= 1) {
        next.delete(platId);
      } else {
        next.set(platId, { ...existing, quantite: existing.quantite - 1 });
      }
      return next;
    });
  };

  const setNote = (platId: number, note: string) => {
    setNotes((prev) => new Map(prev).set(platId, note));
    setPanier((prev) => {
      const next = new Map(prev);
      const existing = next.get(platId);
      if (existing) next.set(platId, { ...existing, noteClient: note });
      return next;
    });
  };

  const total = Array.from(panier.values()).reduce((sum, item) => {
    const plat = plats.find((p) => p.id === item.platId);
    return sum + (plat?.prix ?? 0) * item.quantite;
  }, 0);

  const handleSubmit = async () => {
    setError(null);
    if (typeCommande !== 'A_EMPORTER' && !tableId) {
      setError('Veuillez sélectionner une table.');
      return;
    }
    if (typeCommande === 'A_EMPORTER' && !nomClientRetrait.trim()) {
      setError('Veuillez saisir le nom du client.');
      return;
    }
    if (panier.size === 0) {
      setError('Le panier est vide.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        typeCommande,
        tableId: typeCommande !== 'A_EMPORTER' ? tableId : undefined,
        serveurId,
        nomClientRetrait: typeCommande === 'A_EMPORTER' ? nomClientRetrait : undefined,
        details: Array.from(panier.values()),
      });
      onClose();
    } catch {
      setError('Erreur lors de la création de la commande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nouvelle commande</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Gauche — config + plats */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Type commande */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type de commande
              </label>
              <div className="flex gap-2">
                {(['SUR_PLACE_SERVEUR', 'A_EMPORTER'] as TypeCommande[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeCommande(type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                      ${typeCommande === type
                        ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                      }`}
                  >
                    {type === 'A_EMPORTER' ? <ShoppingBag size={15} /> : <MapPin size={15} />}
                    {type === 'A_EMPORTER' ? 'À emporter' : 'Sur place'}
                  </button>
                ))}
              </div>
            </div>

            {/* Table ou nom client */}
            {typeCommande !== 'A_EMPORTER' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Table
                </label>
                <select
                  value={tableId ?? ''}
                  onChange={(e) => setTableId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Sélectionner une table</option>
                  {tableslibres.map((t) => (
                    <option key={t.id} value={t.id}>
                      Table {t.numeroTable} — {t.statut}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nom du client
                </label>
                <input
                  type="text"
                  value={nomClientRetrait}
                  onChange={(e) => setNomClientRetrait(e.target.value)}
                  placeholder="Ex: Rakoto Jean"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}

            {/* Liste des plats */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Menu
              </label>
              <div className="space-y-2">
                {platsDisponibles.map((plat) => {
                  const qte = panier.get(plat.id)?.quantite ?? 0;
                  return (
                    <div
                      key={plat.id}
                      className={`p-3 rounded-xl border-2 transition-all
                        ${qte > 0
                          ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-700'
                          : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{plat.nom}</p>
                          <p className="text-xs text-gray-400">{plat.prix.toFixed(2)} Ar</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => retirerPlat(plat.id)}
                            disabled={qte === 0}
                            className="p-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                              disabled:opacity-30 hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">
                            {qte}
                          </span>
                          <button
                            onClick={() => ajouterPlat(plat)}
                            className="p-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                      {qte > 0 && (
                        <input
                          type="text"
                          placeholder="Note de cuisson (optionnel)"
                          value={notes.get(plat.id) ?? ''}
                          onChange={(e) => setNote(plat.id, e.target.value)}
                          className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200
                            dark:border-amber-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                            focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Droite — récap panier */}
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Récapitulatif</h3>

            {panier.size === 0 ? (
              <p className="text-xs text-gray-400 italic">Aucun plat sélectionné</p>
            ) : (
              <div className="space-y-2 flex-1">
                {Array.from(panier.values()).map((item) => {
                  const plat = plats.find((p) => p.id === item.platId);
                  if (!plat) return null;
                  return (
                    <div key={item.platId} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{item.quantite}× {plat.nom}</span>
                      <span>{(plat.prix * item.quantite).toFixed(2)} Ar</span>
                    </div>
                  );
                })}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{total.toFixed(2)} Ar</span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || panier.size === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Créer la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};