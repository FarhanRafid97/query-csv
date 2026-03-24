import type { Column, Header } from '@tanstack/react-table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu-v2';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  DrawingPinFilledIcon,
  DrawingPinIcon,
  EyeNoneIcon
} from '@radix-ui/react-icons';

import type { ReactNode } from 'react';
import { match } from 'ts-pattern';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  header: Header<TData, TValue>;
  children?: ReactNode;
  noDropdown?: boolean;
}

export function DataTableColumnHeaderComplete<TData, TValue>({
  column,
  title,

  header,
  noDropdown = false
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (noDropdown) {
    return (
      <div
        className="flex justify-between items-center bg-accent/50 h-full gap-2 w-full  data-[state=open]:bg-muted/90 px-2"
        style={{
          minWidth: `calc(var(--header-${header.id}-size) * 1px - 0px)`,
          width: '100%'
        }}
      >
        <div className="truncate overflow-hidden text-start">
          <span className="text-[12px]  font-normal text-start text-black-shadow font-source-code-pro">{title}</span>
        </div>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex justify-between items-center bg-accent/50 h-full gap-2 w-full  data-[state=open]:bg-muted/90 px-2"
          style={{
            minWidth: `calc(var(--header-${header.id}-size) * 1px )`,
            width: '100%'
          }}
        >
          <div className="truncate overflow-hidden text-start">
            <span className="text-[12px] font-normal  text-start text-black-shadow font-source-code-pro">{title}</span>
          </div>
          <div className="min-w-[14px]">
            {match(column.getIsSorted())
              .with('desc', () => <ArrowDownIcon className=" text-gray-700 size-4" />)
              .with('asc', () => <ArrowUpIcon className=" text-gray-700 size-4" />)
              .otherwise(() => (
                <CaretSortIcon className=" text-gray-400 size-4" />
              ))}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className=" border-gray-200 min-w-60">
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUpIcon className=" size-3" />
          Sort asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDownIcon />
          Sort desc
        </DropdownMenuItem>

        {!header.isPlaceholder && header.column.getCanPin() && (
          <>
            {header.column.getIsPinned() ? (
              <DropdownMenuItem
                onClick={() => {
                  header.column.pin(false);
                }}
              >
                <DrawingPinIcon />
                Unpin column
              </DropdownMenuItem>
            ) : null}
            {header.column.getIsPinned() !== 'right' ? (
              <DropdownMenuItem
                onClick={() => {
                  header.column.pin('right');
                }}
              >
                <DrawingPinFilledIcon />
                Pin to right
              </DropdownMenuItem>
            ) : null}
          </>
        )}
        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          <EyeNoneIcon />
          Hide column
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
