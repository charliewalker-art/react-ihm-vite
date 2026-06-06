import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, QrCode } from 'lucide-react';
import type { TableResponse } from '../../types/table';

interface QRCodeModalProps {
  table: TableResponse;
  onClose: () => void;
}

export const QRCodeModal = ({ table, onClose }: QRCodeModalProps) => {
  const urlCarte = `${window.location.origin}/carte?table=${table.numeroTable}`;

  const handleImprimer = () => {
    const contenu = `
      <html>
        <head>
          <title>QR Code — Table ${table.numeroTable}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: sans-serif;
            }
            h1 { font-size: 24px; margin-bottom: 8px; }
            p  { font-size: 14px; color: #666; margin-bottom: 24px; }
          </style>
        </head>
        <body>
          <h1>Table ${table.numeroTable}</h1>
          <p>Scannez pour commander</p>
          <div id="qr"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
          <script>
            new QRCode(document.getElementById('qr'), {
              text: '${urlCarte}',
              width: 300,
              height: 300,
            });
            setTimeout(() => window.print(), 500);
          </script>
        </body>
      </html>
    `;
    const fenetre = window.open('', '_blank');
    if (fenetre) {
      fenetre.document.write(contenu);
      fenetre.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Table {table.numeroTable}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <QRCodeSVG
              value={urlCarte}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Scannez ce code pour accéder au menu de la table {table.numeroTable}
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-600 text-center break-all">
            {urlCarte}
          </p>
        </div>

        {/* Bouton imprimer */}
        <button
          onClick={handleImprimer}
          className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all"
        >
          <Printer size={18} />
          Imprimer
        </button>
      </div>
    </div>
  );
};