import type { Table } from '@tanstack/react-table';
import { type Dispatch, type SetStateAction } from 'react';
import CompleteToolbar from './complete-toolbar';
import SearchTable from './search-table';

export default function TableToolbar({
  table,
  search,
  data,
  exportHeaders,
  setSearch
}: {
  table: Table<object>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  data: object[];
  exportHeaders: { label: string; key: string }[];
}) {
  return (
    <div className="flex items-center gap-2 justify-between">
      <SearchTable search={search} setSearch={setSearch} />
      <div className="flex items-center gap-2">
        <CompleteToolbar table={table} data={data} exportHeaders={exportHeaders} />
      </div>
    </div>
  );
}
