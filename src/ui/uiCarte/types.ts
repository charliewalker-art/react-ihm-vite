import type { Plat } from '../../types/plat';

export type Onglet = 'menu' | 'panier' | 'commandes';
export type Categorie = 'ENTREE' | 'PLAT' | 'DESSERT' | 'BOISSON';

export interface LignePanier {
  plat: Plat;
  quantite: number;
  note: string;
}

export const CATEGORIES: { value: Categorie; label: string; emoji: string }[] = [
  { value: 'ENTREE', label: 'Entrées', emoji: '🥗' },
  { value: 'PLAT', label: 'Plats', emoji: '🍽️' },
  { value: 'DESSERT', label: 'Desserts', emoji: '🍰' },
  { value: 'BOISSON', label: 'Boissons', emoji: '🥤' },
];