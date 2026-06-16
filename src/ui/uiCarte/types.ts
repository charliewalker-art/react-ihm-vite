import type { Plat } from '../../types/plat';

export type Onglet = 'menu' | 'panier' | 'commandes';
export type Categorie = 'ENTREE' | 'PLAT' | 'DESSERT' | 'BOISSON';

export interface LignePanier {
  plat: Plat;
  quantite: number;
  note: string;
}

export const CATEGORIES: { value: Categorie; label: string }[] = [
  { value: 'ENTREE', label: 'Entrées' },
  { value: 'PLAT', label: 'Plats' },
  { value: 'DESSERT', label: 'Desserts' },
  { value: 'BOISSON', label: 'Boissons' },
];