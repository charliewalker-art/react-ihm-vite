import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Bell } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { useCartePublique } from '../hooks/useCartePublique';
import { CarteHeader } from '../ui/uiCarte/CarteHeader';
import { CarteBottomNav, CarteSideNav } from '../ui/uiCarte/CarteNav';
import { CarteMenu } from '../ui/uiCarte/CarteMenu';
import { CartePanier } from '../ui/uiCarte/CartePanier';
import { CarteCommandes } from '../ui/uiCarte/CarteCommandes';
import { CarteNoteModal } from '../ui/uiCarte/CarteNoteModal';

import type { Plat } from '../types/plat';
import type { DetailCommandeRequest } from '../types/commande';
import type { Onglet, Categorie, LignePanier } from '../ui/uiCarte/types';

const API_WS = import.meta.env.VITE_API_BASE_URL;

export default function CartePage() {
  const [searchParams] = useSearchParams();
  const numeroTable = parseInt(searchParams.get('table') ?? '1');

  // fetchTableByNumero ajouté ici
  const { plats, commandes, loading, fetchMenu, fetchCommandesTable, fetchTableByNumero, passerCommande, appellerServeur } =
    useCartePublique();

  const [darkMode, setDarkMode] = useState(false);
  const [onglet, setOnglet] = useState<Onglet>('menu');
  const [categorieActive, setCategorieActive] = useState<Categorie>('PLAT');
  const [panier, setPanier] = useState<LignePanier[]>([]);
  const [noteModal, setNoteModal] = useState<{ plat: Plat; note: string } | null>(null);
  const [commandeEnCours, setCommandeEnCours] = useState(false);
  const [succesCommande, setSuccesCommande] = useState(false);
  const [appelEnvoye, setAppelEnvoye] = useState(false);
  const [tableId, setTableId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      await fetchMenu();
      //  Appel API déplacé dans le hook
      const id = await fetchTableByNumero(numeroTable);
      if (id) {
        setTableId(id);
        fetchCommandesTable(id);
      }
    };
    init();
  }, [numeroTable]);

  const chargerCommandes = useCallback(() => {
    if (tableId) fetchCommandesTable(tableId);
  }, [tableId, fetchCommandesTable]);

  useEffect(() => {
    if (!tableId) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_WS}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/commandes', () => chargerCommandes());
        client.subscribe('/topic/plats', () => fetchMenu());
      },
    });
    client.activate();
    return () => { client.deactivate(); };
  }, [tableId, chargerCommandes]);

  const ajouterAuPanier = (plat: Plat) => {
    setPanier((prev) => {
      const existe = prev.find((l) => l.plat.id === plat.id);
      if (existe) return prev.map((l) => l.plat.id === plat.id ? { ...l, quantite: l.quantite + 1 } : l);
      return [...prev, { plat, quantite: 1, note: '' }];
    });
  };

  const diminuerQuantite = (platId: number) => {
    setPanier((prev) =>
      prev.map((l) => l.plat.id === platId ? { ...l, quantite: l.quantite - 1 } : l)
         .filter((l) => l.quantite > 0)
    );
  };

  const supprimerDuPanier = (platId: number) => {
    setPanier((prev) => prev.filter((l) => l.plat.id !== platId));
  };

  const mettreAJourNote = (platId: number, note: string) => {
    setPanier((prev) => prev.map((l) => l.plat.id === platId ? { ...l, note } : l));
  };

  const totalPanier = panier.reduce((sum, l) => sum + l.plat.prix * l.quantite, 0);
  const nbArticles = panier.reduce((sum, l) => sum + l.quantite, 0);

  const handleCommander = async () => {
    if (!tableId || panier.length === 0) return;
    setCommandeEnCours(true);
    try {
      const details: DetailCommandeRequest[] = panier.map((l) => ({
        platId: l.plat.id,
        quantite: l.quantite,
        noteClient: l.note || undefined,
      }));
      await passerCommande({ typeCommande: 'SUR_PLACE_QR', tableId, details });
      setPanier([]);
      setSuccesCommande(true);
      setOnglet('commandes');
      setTimeout(() => setSuccesCommande(false), 4000);
      chargerCommandes();
    } catch { /* silencieux */ }
    finally { setCommandeEnCours(false); }
  };

  const handleAppelerServeur = async () => {
    try {
      await appellerServeur(numeroTable);
      setAppelEnvoye(true);
      setTimeout(() => setAppelEnvoye(false), 5000);
    } catch { /* silencieux */ }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">

        <div className="md:hidden">
          <CarteHeader
            numeroTable={numeroTable}
            nbArticles={nbArticles}
            appelEnvoye={appelEnvoye}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            onAppelerServeur={handleAppelerServeur}
            onOnglet={setOnglet}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">

          <CarteSideNav
            onglet={onglet}
            nbArticles={nbArticles}
            appelEnvoye={appelEnvoye}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            onOnglet={setOnglet}
            onAppelerServeur={handleAppelerServeur}
          />

          <div className="flex-1 overflow-y-auto pb-20 md:pb-6">

            <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Table {numeroTable}</p>
                <h1 className="font-bold text-gray-900 dark:text-white text-xl">Notre Menu</h1>
              </div>
            </div>

            <div className="px-4 md:px-6 flex flex-col gap-2 mt-3">
              {succesCommande && (
                <div className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-2xl px-4 py-3
                  text-green-700 dark:text-green-400 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Commande envoyée en cuisine !
                </div>
              )}
              {appelEnvoye && (
                <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-2xl px-4 py-3
                  text-amber-700 dark:text-amber-400 text-sm font-semibold flex items-center gap-2">
                  <Bell size={16} />
                  Le serveur arrive !
                </div>
              )}
            </div>

            {onglet === 'menu' && (
              <CarteMenu
                plats={plats}
                panier={panier}
                categorieActive={categorieActive}
                onCategorie={setCategorieActive}
                onAjouter={ajouterAuPanier}
                onDiminuer={diminuerQuantite}
              />
            )}

            {onglet === 'panier' && (
              <CartePanier
                panier={panier}
                totalPanier={totalPanier}
                commandeEnCours={commandeEnCours}
                onAjouter={ajouterAuPanier}
                onDiminuer={diminuerQuantite}
                onSupprimer={supprimerDuPanier}
                onNoteModal={(plat, note) => setNoteModal({ plat, note })}
                onCommander={handleCommander}
              />
            )}

            {onglet === 'commandes' && (
              <CarteCommandes commandes={commandes} loading={loading} />
            )}
          </div>
        </div>

        <CarteBottomNav
          onglet={onglet}
          nbArticles={nbArticles}
          appelEnvoye={appelEnvoye}
          onOnglet={setOnglet}
          onAppelerServeur={handleAppelerServeur}
        />

        {noteModal && (
          <CarteNoteModal
            plat={noteModal.plat}
            note={noteModal.note}
            onNote={(note) => setNoteModal({ ...noteModal, note })}
            onConfirmer={() => {
              mettreAJourNote(noteModal.plat.id, noteModal.note);
              setNoteModal(null);
            }}
            onFermer={() => setNoteModal(null)}
          />
        )}
      </div>
    </div>
  );
}