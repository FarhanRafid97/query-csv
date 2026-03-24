import { cn } from '@/lib/utils';
import type { Table } from '@tanstack/react-table';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: Readonly<DataTableViewOptionsProps<TData>>) {
  return (
    <div className="space-y-2 font-geist">
      <div className="text-[11px] font-medium text-primary mb-4">Displays preferences</div>

      <div className="flex flex-wrap gap-1.5 space-y-0.5 overflow-y-auto ">
        {table.getAllColumns().map((column) => {
          return (
            <button
              key={column.id}
              className={cn(
                'cursor-default rounded-xl min-w-6 px-1  border-[0.5px]',
                column.getIsVisible() ? 'bg-secondary   ' : '  text-primary'
              )}
              onClick={() => column.toggleVisibility()}
            >
              <div className="text-xs font-normal m-1">{column.id}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
