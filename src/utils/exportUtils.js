import { jsPDF } from 'jspdf';
import { getLanguageName } from './languages';

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(text, filename = 'translation.txt') {
  downloadBlob(text, filename, 'text/plain;charset=utf-8;');
}

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function exportHistoryAsCSV(history) {
  const headers = ['Date', 'From', 'To', 'Source Text', 'Translated Text', 'Favorite'];
  const rows = history.map((item) => [
    new Date(item.timestamp).toLocaleString(),
    getLanguageName(item.fromLang),
    getLanguageName(item.toLang),
    csvEscape(item.sourceText),
    csvEscape(item.translatedText),
    item.isFavorite ? 'Yes' : 'No',
  ]);
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadBlob(csvContent, 'linguaflow-history.csv', 'text/csv;charset=utf-8;');
}

export function exportHistoryAsPDF(history) {
  const doc = new jsPDF();
  const margin = 14;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('LinguaFlow AI — Translation History', margin, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toLocaleString()} • ${history.length} entries`, margin, y);
  doc.setTextColor(20);
  y += 10;

  history.forEach((item, index) => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${index + 1}. ${getLanguageName(item.fromLang)} -> ${getLanguageName(item.toLang)}`, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const sourceLines = doc.splitTextToSize(`Source: ${item.sourceText}`, 180);
    doc.text(sourceLines, margin, y);
    y += sourceLines.length * 5;

    const translatedLines = doc.splitTextToSize(`Translated: ${item.translatedText}`, 180);
    doc.text(translatedLines, margin, y);
    y += translatedLines.length * 5 + 7;
  });

  doc.save('linguaflow-history.pdf');
}
