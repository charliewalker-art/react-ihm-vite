import { jsPDF } from 'jspdf';
import type { CommandeResponse, ModePaiement } from '../types/commande';

export const genererFacturePDF = (
  groupeCommandes: CommandeResponse[],
  modePaiement: ModePaiement,
  pourboire: number
) => {
  // Calcul de la hauteur dynamique du ticket selon le nombre d'articles
  const nbArticles = groupeCommandes.reduce((sum, cmd) => sum + cmd.details.length, 0);
  const hauteurTicket = 120 + nbArticles * 8;

  // Initialisation du document au format ticket de caisse (80mm de large)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, hauteurTicket],
  });

  // Configuration de la police de caractères
  doc.setFont('helvetica', 'normal');

  // Entête du restaurant
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('STITCH RESTO', 40, 12, { align: 'center' });

  // Informations générales
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleString('fr-FR');
  doc.text(`Date : ${dateStr}`, 10, 22);

  const premiereCmd = groupeCommandes[0];
  let infoTable = '';
  if (premiereCmd.tableNumero) infoTable = `Table : ${premiereCmd.tableNumero}`;
  else if (premiereCmd.tableId) infoTable = `Table : ${premiereCmd.tableId}`;
  else if (premiereCmd.nomClientRetrait) infoTable = `Client : ${premiereCmd.nomClientRetrait}`;
  else infoTable = `Commande # ${premiereCmd.id}`;

  doc.text(infoTable, 10, 27);
  doc.text(`Mode de paiement : ${modePaiement}`, 10, 32);

  // Ligne de séparation
  doc.setLineWidth(0.2);
  doc.line(10, 35, 70, 35);

  // Colonnes du tableau
  doc.setFont('helvetica', 'bold');
  doc.text('Qté', 10, 40);
  doc.text('Désignation', 20, 40);
  doc.text('Total', 70, 40, { align: 'right' });
  doc.line(10, 42, 70, 42);

  // Liste des plats
  doc.setFont('helvetica', 'normal');
  let y = 47;
  let montantTotalGroupe = 0;

  groupeCommandes.forEach((cmd) => {
    montantTotalGroupe += cmd.montantTotal;
    cmd.details.forEach((d) => {
      doc.text(`${d.quantite}`, 10, y);

      // Tronquer le nom du plat s'il est trop long pour le ticket de caisse
      const nomPlat = d.platNom.length > 22 ? d.platNom.substring(0, 22) + '...' : d.platNom;
      doc.text(nomPlat, 20, y);

      doc.text(`${d.sousTotal.toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
      y += 6;
    });
  });

  // Ligne de séparation avant totaux
  doc.line(10, y, 70, y);
  y += 6;

  // Calculs financiers
  doc.text('Sous-Total :', 10, y);
  doc.text(`${montantTotalGroupe.toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
  y += 6;

  if (pourboire > 0) {
    doc.text('Pourboire :', 10, y);
    doc.text(`${pourboire.toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
    y += 6;
  }

  // Total Net à payer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL NET :', 10, y);
  doc.text(`${(montantTotalGroupe + pourboire).toLocaleString('fr-MG')} Ar`, 70, y, { align: 'right' });
  y += 12;

  // Message de courtoisie
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('Merci de votre visite et à bientôt !', 40, y, { align: 'center' });

  // Lancement du téléchargement automatique du fichier PDF
  const nomFichier = `facture_table_${premiereCmd.tableId ?? 'caisse'}_${Date.now()}.pdf`;
  doc.save(nomFichier);
};