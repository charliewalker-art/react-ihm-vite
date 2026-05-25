import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ dark, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-all duration-200"
      aria-label="Changer le thème"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};