/**
 * Utility function to trigger client-side file downloads
 * for documents, dossier reports, voting records, and evidence files.
 */

export function downloadFile(filename: string, content: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(
  filename: string,
  headersOrData: string[] | Record<string, any>[],
  rows?: (string | number)[][]
) {
  let csvContent = '';
  if (Array.isArray(headersOrData) && rows) {
    // Overload 1: headers and rows
    csvContent = [
      (headersOrData as string[]).join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
  } else if (Array.isArray(headersOrData) && headersOrData.length > 0) {
    // Overload 2: array of objects
    const data = headersOrData as Record<string, any>[];
    const headers = Object.keys(data[0]);
    csvContent = [
      headers.join(','),
      ...data.map(obj => headers.map(h => `"${String(obj[h] ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
  } else {
    csvContent = '';
  }
  downloadFile(filename, csvContent, 'text/csv');
}
