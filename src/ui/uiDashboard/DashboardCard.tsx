import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route: string;
}

export const DashboardCard = ({
  title,
  description,
  icon: Icon,
  color,
  route,
}: DashboardCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(route)}
      className="w-full text-left p-6 rounded-2xl bg-white dark:bg-gray-900
                 border border-gray-100 dark:border-gray-800
                 shadow-sm hover:shadow-md dark:shadow-gray-950/50
                 hover:-translate-y-1 transition-all duration-200
                 group"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4
                       group-hover:scale-110 transition-transform duration-200`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </button>
  );
};