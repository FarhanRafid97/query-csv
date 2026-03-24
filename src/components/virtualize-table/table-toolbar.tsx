import type { Table } from '@tanstack/react-table';
import { type Dispatch, type SetStateAction } from 'react';
import CompleteToolbar from './complete-toolbar';
import SearchTable from './search-table';
import { DataGridRowHeightMenu } from './select-column-height';

export default function TableToolbar({
  table,
  search,
  data,

  setSearch
}: {
  table: Table<object>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  data: object[];
}) {
  return (
    <div className="flex items-center gap-2 justify-between">
      <SearchTable search={search} setSearch={setSearch} />
      <div className="flex items-center gap-2">
        <DataGridRowHeightMenu table={table} />
        <CompleteToolbar table={table} />
      </div>
    </div>
  );
}
