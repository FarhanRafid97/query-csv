import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { Separator } from '../ui/separator';
import { DataTableViewOptions } from './data-table-view-options';

const CompleteToolbar = ({ table }: { table: Table<object> }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full wrapper-box-linear p-2 cursor-pointer">
          <MixerHorizontalIcon className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-84 p-0">
        <PopoverHeader className="p-4">
          <PopoverTitle className="text-[11px] font-medium text-primary flex items-center gap-2">
            {' '}
            <MixerHorizontalIcon className="size-3" /> Toolbar Options
          </PopoverTitle>
        </PopoverHeader>
        <div className="p-4"></div>
        <Separator />
        <div className="p-4">
          <DataTableViewOptions table={table} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompleteToolbar;
