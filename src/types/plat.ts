export type Categorie = 'ENTREE' | 'PLAT' | 'DESSERT' | 'BOISSON';

export interface Plat {
  id: number;
  nom: string;
  description: string;
  prix: number;
  categorie: Categorie;
  disponible: boolean;
  allergenes: string;
  quantitePerdueJour: number;
  imageUrl: string;
}

export interface PlatRequest {
  nom: string;
  description: string;
  prix: number;
  categorie: Categorie;
  allergenes: string;
  imageUrl: string;
}