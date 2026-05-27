import { UtensilsCrossed, ShoppingCart, ClipboardList, Bell } from 'lucide-react';
import type { Onglet } from './types';

interface CarteBottomNavProps {
  onglet: Onglet;
  nbArticles: number;
  appelEnvoye: boolean;
  onOnglet: (o: Onglet) => void;
  onAppelerServeur: () => void;
}

export const CarteBottomNav = ({
  onglet, nbArticles, appelEnvoye, onOnglet, onAppelerServeur
}: CarteBottomNavProps) => (
  <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900 border-t border-gray-800
    flex md:hidden">
    <button
      onClick={() => onOnglet('menu')}
      className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all
        ${onglet === 'menu' ? 'text-amber-400' : 'text-gray-500'}`}
    >
      <UtensilsCrossed size={20} />
      Menu
    </button>
    <button
      onClick={() => onOnglet('panier')}
      className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all relative
        ${onglet === 'panier' ? 'text-amber-400' : 'text-gray-500'}`}
    >
      <ShoppingCart size={20} />
      Panier
      {nbArticles > 0 && (
        <span className="absolute top-2 right-8 bg-amber-500 text-white text-xs font-bold
          w-4 h-4 rounded-full flex items-center justify-center">
          {nbArticles}
        </span>
      )}
    </button>
    <button
      onClick={() => onOnglet('commandes')}
      className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all
        ${onglet === 'commandes' ? 'text-amber-400' : 'text-gray-500'}`}
    >
      <ClipboardList size={20} />
      Commandes
    </button>
    <button
      onClick={onAppelerServeur}
      className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all
        ${appelEnvoye ? 'text-green-400' : 'text-gray-500'}`}
    >
      <Bell size={20} />
      Serveur
    </button>
  </div>
);

// Sidebar pour desktop/tablette
export const CarteSideNav = ({
  onglet, nbArticles, appelEnvoye, onOnglet, onAppelerServeur
}: CarteBottomNavProps) => (
  <div className="hidden md:flex flex-col w-56 bg-gray-900 border-r border-gray-800 sticky top-0 h-screen p-3 gap-1">
    {[
      { value: 'menu' as Onglet, label: 'Menu', Icon: UtensilsCrossed },
      { value: 'panier' as Onglet, label: `Panier${nbArticles > 0 ? ` (${nbArticles})` : ''}`, Icon: ShoppingCart },
      { value: 'commandes' as Onglet, label: 'Mes commandes', Icon: ClipboardList },
    ].map(({ value, label, Icon }) => (
      <button
        key={value}
        onClick={() => onOnglet(value)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
          ${onglet === value
            ? 'bg-amber-500 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
      >
        <Icon size={18} />
        {label}
      </button>
    ))}
    <button
      onClick={onAppelerServeur}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mt-auto
        ${appelEnvoye ? 'bg-green-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
      <Bell size={18} />
      Appeler le serveur
    </button>
  </div>
);