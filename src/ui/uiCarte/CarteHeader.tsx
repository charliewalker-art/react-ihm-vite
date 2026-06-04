import { Bell, ShoppingCart, Sun, Moon } from 'lucide-react';
import type { Onglet } from './types';

interface CarteHeaderProps {
  numeroTable: number;
  nbArticles: number;
  appelEnvoye: boolean;
  darkMode: boolean;
  onToggleDark: () => void;
  onAppelerServeur: () => void;
  onOnglet: (o: Onglet) => void;
}

export const CarteHeader = ({
  numeroTable, nbArticles, appelEnvoye, darkMode, onToggleDark, onAppelerServeur, onOnglet
}: CarteHeaderProps) => (
  <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-widest">Table {numeroTable}</p>
      <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">Notre Menu</h1>
    </div>
    <div className="flex items-center gap-2">

      {/* Toggle dark/light */}
      <button
        onClick={onToggleDark}
        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        title={darkMode ? 'Mode clair' : 'Mode sombre'}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Appeler serveur */}
      <button
        onClick={onAppelerServeur}
        className={`p-2 rounded-xl transition-all ${
          appelEnvoye
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-amber-500 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="Appeler le serveur"
      >
        <Bell size={18} />
      </button>

      {/* Panier */}
      <button
        onClick={() => onOnglet('panier')}
        className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-amber-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        <ShoppingCart size={18} />
        {nbArticles > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold
            w-4 h-4 rounded-full flex items-center justify-center">
            {nbArticles}
          </span>
        )}
      </button>
    </div>
  </div>
);