import { FileIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';

const ExportCsv = ({ getData, headers }: {
  getData: () => object[];
  headers: { label: string; key: string }[];
}) => {
  const handleExport = useCallback(() => {
    const data = getData();
    const headerRow = headers.map((h) => h.label).join(',');
    const rows = data.map((row) => {
      const r = row as Record<string, unknown>;
      return headers.map((h) => {
        const val = r[h.key];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',');
    });

    const csv = [headerRow, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [getData, headers]);

  return (
    <button onClick={handleExport} className="flex items-center gap-1 text-xs cursor-pointer hover:text-primary">
      <FileIcon className="w-3 h-3" />
      Save as CSV
    </button>
  );
};

export default ExportCsv;
