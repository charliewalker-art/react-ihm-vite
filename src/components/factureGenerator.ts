import { jsPDF } from 'jspdf';
import type { CommandeResponse, ModePaiement } from '../types/commande';

// ─── Charte graphique (alignée sur la palette Tailwind de l'app) ──────────────
const COLOR_AMBER = [217, 119, 6] as const;     // amber-600 → accent, titres, total
const COLOR_AMBER_LIGHT = [245, 158, 11] as const; // amber-500 → filets fins
const COLOR_GRAY_900 = [17, 24, 39] as const;   // gray-900 → texte fort
const COLOR_GRAY_600 = [75, 85, 99] as const;   // gray-600 → texte courant
const COLOR_GRAY_400 = [156, 163, 175] as const; // gray-400 → texte secondaire / footer
const COLOR_GRAY_200 = [229, 231, 235] as const; // gray-200 → filets discrets

export const genererFacturePDF = (
  groupeCommandes: CommandeResponse[],
  modePaiement: ModePaiement,
  pourboire: number
) => {
  // Calcul de la hauteur dynamique du ticket selon le nombre d'articles
  const nbArticles = groupeCommandes.reduce((sum, cmd) => sum + cmd.details.length, 0);
  const hauteurTicket = 125 + nbArticles * 8;

  // Initialisation du document au format ticket de caisse (80mm de large)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, hauteurTicket],
  });

  doc.setFont('helvetica', 'normal');

  // ─── Bandeau d'en-tête (fond amber, texte blanc) ───────────────────────────
  doc.setFillColor(...COLOR_AMBER);
  doc.rect(0, 0, 80, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('RestaurantApp', 40, 10, { align: 'center' });

  // Filet fin amber clair juste sous le bandeau pour la profondeur
  doc.setDrawColor(...COLOR_AMBER_LIGHT);
  doc.setLineWidth(0.4);
  doc.line(0, 16, 80, 16);

  // ─── Informations générales ────────────────────────────────────────────────
  doc.setTextColor(...COLOR_GRAY_600);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleString('fr-FR');
  doc.text(`Date : ${dateStr}`, 10, 24);

  const premiereCmd = groupeCommandes[0];
  let infoTable = '';
  if (premiereCmd.numeroTable) infoTable = `Table : ${premiereCmd.numeroTable}`;
  else if (premiereCmd.tableId) infoTable = `Table : ${premiereCmd.tableId}`;
  else if (premiereCmd.nomClientRetrait) infoTable = `Client : ${premiereCmd.nomClientRetrait}`;
  else infoTable = `Commande # ${premiereCmd.id}`;
  doc.setTextColor(...COLOR_GRAY_900);
  doc.setFont('helvetica', 'bold');
  doc.text(infoTable, 10, 29);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY_600);
  doc.text(`Mode de paiement : ${modePaiement}`, 10, 34);

  // Ligne de séparation discrète (gray-200, comme les borders de cards dans l'app)
  doc.setDrawColor(...COLOR_GRAY_200);
  doc.setLineWidth(0.3);
  doc.line(10, 37, 70, 37);

  // ─── En-tête du tableau ────────────────────────────────────────────────────
  doc.setTextColor(...COLOR_GRAY_900);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Qté', 10, 42);
  doc.text('Désignation', 20, 42);
  doc.text('Total', 70, 42, { align: 'right' });

  // Filet amber sous l'en-tête de colonnes (au lieu du noir plat d'origine)
  doc.setDrawColor(...COLOR_AMBER_LIGHT);
  doc.setLineWidth(0.4);
  doc.line(10, 44, 70, 44);

  // ─── Liste des plats ───────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_GRAY_600);
  let y = 49;
  let montantTotalGroupe = 0;
  groupeCommandes.forEach((cmd) => {
    montantTotalGroupe += cmd.montantTotal;
    cmd.details.forEach((d) => {
      doc.text(`${d.quantite}`, 10, y);
      // Tronquer le nom du plat s'il est trop long pour le ticket de caisse
      const nomPlat = d.platNom.length > 22 ? d.platNom.substring(0, 22) + '...' : d.platNom;
      doc.setTextColor(...COLOR_GRAY_900);
      doc.text(nomPlat, 20, y);
      doc.setTextColor(...COLOR_GRAY_600);
      doc.text(`${d.sousTotal.toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
      y += 6;
    });
  });

  // Ligne de séparation discrète avant les totaux
  doc.setDrawColor(...COLOR_GRAY_200);
  doc.setLineWidth(0.3);
  doc.line(10, y, 70, y);
  y += 6;

  // ─── Calculs financiers ────────────────────────────────────────────────────
  doc.setTextColor(...COLOR_GRAY_600);
  doc.text('Sous-Total :', 10, y);
  doc.text(`${montantTotalGroupe.toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
  y += 6;

  if (pourboire > 0) {
    doc.text('Pourboire :', 10, y);
    doc.text(`${pourboire.toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
    y += 6;
  }

  // Filet amber avant le total net pour bien le détacher visuellement
  doc.setDrawColor(...COLOR_AMBER_LIGHT);
  doc.setLineWidth(0.4);
  doc.line(10, y, 70, y);
  y += 7;

  // Total Net à payer — accent amber, comme les CTA de l'app
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_AMBER);
  doc.text('TOTAL NET :', 10, y);
  doc.text(`${(montantTotalGroupe + pourboire).toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
  y += 13;

  // ─── Message de courtoisie ─────────────────────────────────────────────────
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_GRAY_400);
  doc.text('Merci de votre visite et à bientôt !', 40, y, { align: 'center' });

  // Lancement du téléchargement automatique du fichier PDF
  const nomFichier = `facture_table_${premiereCmd.tableId ?? 'caisse'}_${Date.now()}.pdf`;
  doc.save(nomFichier);
};