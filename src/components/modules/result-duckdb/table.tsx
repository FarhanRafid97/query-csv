import { VirtualizeTable } from '@/components/virtualize-table/table';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { generateColumns } from './column';

export default function TableTanstack({
  data,
  headers
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[][];
  headers: string[];
}) {
  const columns = useMemo(() => generateColumns(headers), [headers]);
  const tableData = useMemo(() => {
    return data.map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: Record<string, any> = {};
      for (let i = 0; i < headers.length; i++) {
        obj[headers[i]] = row[i];
      }
      return obj;
    });
  }, [data, headers]);

  if (tableData.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <p>No data</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="flex flex-col gap-2">
        <VirtualizeTable data={tableData} columns={columns as ColumnDef<object>[]} />
      </div>
    </div>
  );
}
