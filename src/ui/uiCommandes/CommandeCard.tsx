import { useState } from 'react';
import {
  ChefHat,
  CheckCircle,
  XCircle,
  Utensils,
  Receipt,
  Clock,
  MapPin,
  User,
  ShoppingBag,
  AlertTriangle,
} from 'lucide-react';
import type { CommandeResponse } from '../../types/commande';
import { StatutCommandeBadge } from './StatutCommandeBadge';

interface CommandeCardProps {
  commande: CommandeResponse;
  userRole: string;
  userId: number;
  onValider?: (id: number) => Promise<void>;
  onMarquerServie?: (id: number) => Promise<void>;
  onDemanderAddition?: (id: number) => Promise<void>;
  onAnnuler?: (id: number) => void; // ouvre la modal d'annulation
}

export const CommandeCard = ({
  commande,
  userRole,

  onValider,
  onMarquerServie,
  onDemanderAddition,
  onAnnuler,
}: CommandeCardProps) => {
  const [actionLoading, setActionLoading] = useState(false);

  const handle = async (fn?: (id: number) => Promise<void>) => {
    if (!fn) return;
    setActionLoading(true);
    try {
      await fn(commande.id);
    } finally {
      setActionLoading(false);
    }
  };

  const minutesDepuisCreation = Math.floor(
    (Date.now() - new Date(commande.dateCreation).getTime()) / 60000
  );
  const estEnRetard =
    commande.statut === 'EN_ATTENTE_CUISINE' && minutesDepuisCreation > 15;

  const typeIcon =
    commande.typeCommande === 'A_EMPORTER' ? (
      <ShoppingBag size={14} className="text-amber-500" />
    ) : (
      <MapPin size={14} className="text-blue-500" />
    );

  const typeLabel =
    commande.typeCommande === 'A_EMPORTER'
      ? `À emporter — ${commande.nomClientRetrait ?? ''}`
      : `Table ${commande.numeroTable ?? '?'}`;

  // Quelles actions montrer selon le rôle et le statut
  const peutValider =
    commande.statut === 'CREEE' &&
    (userRole === 'SERVEUR' || userRole === 'MANAGER') &&
    onValider;

  const peutMarquerServie =
    commande.statut === 'PRETE' &&
    (userRole === 'SERVEUR' || userRole === 'MANAGER') &&
    onMarquerServie;

  const peutDemanderAddition =
    commande.statut === 'SERVIE' &&
    (userRole === 'SERVEUR' || userRole === 'MANAGER') &&
    onDemanderAddition;

  const peutAnnuler =
    (commande.statut === 'CREEE' || commande.statut === 'EN_ATTENTE_CUISINE') &&
    (userRole === 'SERVEUR' || userRole === 'MANAGER') &&
    onAnnuler;

  const isTerminee =
    commande.statut === 'PAYEE' || commande.statut === 'ANNULEE';

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl border-2 transition-all duration-200
        ${estEnRetard ? 'border-red-400 shadow-red-100 dark:shadow-red-900/20 shadow-md' : 'border-gray-100 dark:border-gray-800'}
        ${isTerminee ? 'opacity-60' : ''}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {typeIcon}
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {typeLabel}
            </span>
            {estEnRetard && (
              <span className="flex items-center gap-1 text-xs text-red-600 font-semibold animate-pulse">
                <AlertTriangle size={12} />
                Retard
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {minutesDepuisCreation} min
            </span>
            {commande.serveurNomComplet && (
              <span className="flex items-center gap-1">
                <User size={11} />
                {commande.serveurNomComplet}
              </span>
            )}
            <span className="text-gray-300">#{commande.id}</span>
          </div>
        </div>
        <StatutCommandeBadge statut={commande.statut} />
      </div>

      {/* Détails plats */}
      <div className="p-4 space-y-2">
        {commande.details.map((d) => (
          <div key={d.id} className="flex items-start justify-between gap-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 min-w-5 text-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded px-1">
                {d.quantite}×
              </span>
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{d.platNom}</p>
                {d.noteClient && (
                  <p className="text-xs text-gray-400 italic">"{d.noteClient}"</p>
                )}
              </div>
            </div>
            <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
              {d.sousTotal.toFixed(2)} Ar
            </span>
          </div>
        ))}
      </div>

      {/* Footer total + actions */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-base font-bold text-gray-900 dark:text-white">
          {commande.montantTotal.toFixed(2)} Ar
        </span>

        {/* Bloc annulation info */}
        {commande.statut === 'ANNULEE' && commande.motifAnnulation && (
          <p className="text-xs text-red-500 italic w-full">
            Annulé : {commande.motifAnnulation}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {peutAnnuler && (
            <button
              onClick={() => onAnnuler!(commande.id)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400
                dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
            >
              <XCircle size={14} />
              Annuler
            </button>
          )}

          {peutValider && (
            <button
              onClick={() => handle(onValider)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20
                dark:text-yellow-400 dark:hover:bg-yellow-900/40 transition-colors disabled:opacity-50"
            >
              <ChefHat size={14} />
              Envoyer en cuisine
            </button>
          )}

          {peutMarquerServie && (
            <button
              onClick={() => handle(onMarquerServie)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20
                dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
            >
              <Utensils size={14} />
              Marquer servie
            </button>
          )}

          {peutDemanderAddition && (
            <button
              onClick={() => handle(onDemanderAddition)}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20
                dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50"
            >
              <Receipt size={14} />
              Demander l'addition
            </button>
          )}

          {commande.statut === 'EN_ATTENTE_PAIEMENT' && (
            <span className="flex items-center gap-1 text-xs text-purple-600 font-semibold">
              <CheckCircle size={14} />
              En attente caisse
            </span>
          )}
        </div>
      </div>
    </div>
  );
};