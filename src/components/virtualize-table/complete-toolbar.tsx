import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { Separator } from '../ui/separator';
import { DataTableViewOptions } from './data-table-view-options';
import { DataGridRowHeightMenu } from './select-column-height';
import ExportCsv from '../modules/export-csv';

const CompleteToolbar = ({
  table,
  data,
  exportHeaders
}: {
  table: Table<object>;
  data: object[];
  exportHeaders: { label: string; key: string }[];
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full wrapper-box-linear p-2 cursor-pointer">
          <MixerHorizontalIcon className="size-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-84 p-0">
        <PopoverHeader className="p-4">
          <PopoverTitle className="text-xs font-medium  flex items-center gap-2">
            {' '}
            <MixerHorizontalIcon className="size-3" /> Toolbar Options
          </PopoverTitle>
        </PopoverHeader>
        <div className="p-4">
          <div className="">
            <ExportCsv getData={() => data} headers={exportHeaders} />
          </div>
        </div>
        <Separator />
        <div className="p-4">
          <div className="w-full flex items-center justify-between">
            <p className="text-xs font-medium ">Row Height</p>
            <DataGridRowHeightMenu />
          </div>
        </div>
        <Separator />
        <div className="p-4">
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs font-medium mb-2">Displays preferences</p>

            <DataTableViewOptions table={table} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompleteToolbar;
