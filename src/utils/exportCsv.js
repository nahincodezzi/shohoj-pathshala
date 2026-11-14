/**
 * Sohoj Pathshala — UTF-8 BOM CSV Export Utility
 * Safely exports datasets containing Bengali Unicode text to CSV format
 * ensuring flawless rendering in Microsoft Excel, Google Sheets, and LibreOffice.
 */

export function exportToCsv(filename, headers, rows) {
  try {
    const csvContent = [
      // Header row
      headers.map(h => `"${(h || '').replace(/"/g, '""')}"`).join(','),
      // Data rows
      ...rows.map(row => 
        row.map(val => {
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(',')
      )
    ].join('\r\n');

    // Prepend UTF-8 Byte Order Mark (BOM) so Excel detects Bengali Unicode
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to export CSV:', err);
    return false;
  }
}

