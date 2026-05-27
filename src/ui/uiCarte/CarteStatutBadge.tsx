import { Clock, Flame, CheckCircle2, AlertTriangle } from 'lucide-react';

const config: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  EN_ATTENTE_CUISINE: {
    label: 'En attente cuisine',
    icon: <Clock size={12} />,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  EN_PREPARATION: {
    label: 'En préparation',
    icon: <Flame size={12} />,
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  PRETE: {
    label: '🎉 Prête !',
    icon: <CheckCircle2 size={12} />,
    className: 'bg-green-100 text-green-700 border-green-200 animate-pulse',
  },
  SERVIE: {
    label: 'Servie',
    icon: <CheckCircle2 size={12} />,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  EN_ATTENTE_PAIEMENT: {
    label: 'En attente paiement',
    icon: <AlertTriangle size={12} />,
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
};

export const CarteStatutBadge = ({ statut }: { statut: string }) => {
  const c = config[statut] ?? { label: statut, icon: null, className: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.className}`}>
      {c.icon}{c.label}
    </span>
  );
};