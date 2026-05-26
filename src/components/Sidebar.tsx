import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  BookOpen,
  Users,
  ChefHat,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const menuByRole: Record<string, { label: string; icon: any; route: string }[]> = {
  MANAGER: [
    { label: "Tables", icon: LayoutGrid, route: "/tables" },
    { label: "Commandes", icon: ClipboardList, route: "/commandes" },
    { label: "Menu", icon: BookOpen, route: "/menu" },
  ],
  RESPONSABLE_PERSONNEL: [
    { label: "Staff", icon: Users, route: "/users" },
  ],
  SERVEUR: [
    { label: "Tables", icon: LayoutGrid, route: "/serveur" },
    { label: "Commandes", icon: ClipboardList, route: "/commandes" },
  ],
  CUISINIERE: [
    { label: "Cuisine", icon: ChefHat, route: "/cuisine" },
  ],
  CAISSIER: [
    { label: "Caisse", icon: CreditCard, route: "/caisse" },
  ],
};

const Sidebar = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = menuByRole[user?.role || ""] || [];

  return (
    <aside className={`h-screen sticky top-0 flex flex-col
                       bg-white dark:bg-gray-900
                       border-r border-gray-100 dark:border-gray-800
                       transition-all duration-300 shrink-0
                       ${collapsed ? "w-16" : "w-56"}`}>

      {/* Toggle collapse */}
      <div className="flex justify-end p-3 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100
                     dark:hover:bg-gray-800 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex-1 p-2 space-y-1 overflow-hidden">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.route;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                          text-sm font-medium transition-all duration-200
                          ${active
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;