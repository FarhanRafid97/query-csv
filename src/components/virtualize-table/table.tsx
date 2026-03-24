import { cn } from '@/lib/utils';
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table,
  VisibilityState
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import type { Virtualizer } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { type CSSProperties } from 'react';
import { TableBody as TableBodyComp, Table as TableComp } from '../ui/table_v2';
import { DataTablePagination } from './data-table-pagination';
import TableToolbar from './table-toolbar';
import WrapperVirtualizeTable from './wrapper-virtualize-table';
import { useRowHeightStore } from '@/store/row-height';
import { getLineCount, getRowHeightValue } from '@/lib/helper';
import { match } from 'ts-pattern';

function getCommonPinningStyles<T>(column: Column<T>): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px var(--border) inset'
      : isFirstRightPinnedColumn
      ? '4px 0 4px -4px var(--border) inset'
      : undefined,

    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'var(--background)' : 'var(--background)',
    width: column.getSize(),
    zIndex: isPinned ? 1 : undefined
  };
}

export function VirtualizeTable({ columns, data }: { columns: ColumnDef<object>[]; data: object[] }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState('');

  const { rowHeight } = useRowHeightStore();
  const heightCell = getRowHeightValue(rowHeight);
  const heightHeader = getRowHeightValue('short');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter: search,
      columnFilters
    },

    initialState: {
      columnPinning: {
        right: []
      },
      pagination: {
        pageSize: 100
      }
    },
    defaultColumn: {
      minSize: 70,
      maxSize: 600
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearch,
    columnResizeMode: 'onChange',

    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const tableContainerRef = React.useRef<HTMLTableElement>(null);

  const columnSizingInfo = table.getState().columnSizingInfo;
  const columnSizing = table.getState().columnSizing;

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }

    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizingInfo, columnSizing, table]);

  const isSizing = React.useMemo(() => {
    return table.getState().columnSizingInfo.isResizingColumn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo.isResizingColumn]);

  return (
    <div className="w-full h-full   flex flex-col gap-2 ">
      <div className="px-6">
        <TableToolbar data={data} table={table} search={search} setSearch={setSearch} />
      </div>
      <div className="rounded-none overflow-hidden  border-y">
        <WrapperVirtualizeTable ref={tableContainerRef} className="">
          <TableComp
            className="w-full relative"
            style={{
              display: 'grid',
              minWidth: '100%',
              ...columnSizeVars
            }}
          >
            <thead className=" sticky top-0  z-50 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} style={{ display: 'flex', width: '100%', height: heightHeader }}>
                  {headerGroup.headers.map((header) => {
                    const isPined = header.column.getIsPinned();
                    return (
                      <th
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        key={header.id}
                        className={cn(
                          'grid place-items-center  not-first:border-l p-0 relative ',
                          isPined ? ' bg-background backdrop-blur-md' : ''
                        )}
                        style={{
                          ...getCommonPinningStyles(header.column),
                          minWidth: `calc(var(--header-${header?.id}-size) * 1px)`,
                          flex: 1
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.id === 'actions' ? null : (
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              className: cn(
                                `bg-gray-300 opacity-0 hover:opacity-100  flex h-full resizer`,
                                header.column.getIsResizing() ? 'isResizing' : ''
                              )
                            }}
                          />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            {isSizing ? (
              <MemoizedTableBodyWrapper table={table} tableContainerRef={tableContainerRef} heightCell={heightCell} />
            ) : (
              <TableBodyWrapper table={table} tableContainerRef={tableContainerRef} heightCell={heightCell} />
            )}
          </TableComp>
        </WrapperVirtualizeTable>
      </div>
      <div className="px-6 pb-4 ">
        {' '}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

export const MemoizedTableBodyWrapper = React.memo(TableBodyWrapper) as React.FC<
  TableBodyWrapperProps & { heightCell: number }
>;

interface TableBodyWrapperProps {
  table: Table<object>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  heightCell: number;
}

function TableBodyWrapper({ table, heightCell, tableContainerRef }: TableBodyWrapperProps) {
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => heightCell,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 3
  });

  React.useLayoutEffect(() => {
    rowVirtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);

  return <TableBody rowVirtualizer={rowVirtualizer} table={table} heightCell={heightCell} />;
}

interface TableBodyProps {
  table: Table<object>;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  heightCell: number;
}

function TableBody({ rowVirtualizer, table, heightCell }: TableBodyProps) {
  const { rows } = table.getRowModel();
  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <TableBodyComp
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: 'relative'
      }}
    >
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return (
          <TableBodyRowMemo
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
            heightCell={heightCell}
          />
        );
      })}
    </TableBodyComp>
  );
}

interface TableBodyRowProps {
  row: Row<object>;
  virtualRow: ReturnType<Virtualizer<HTMLDivElement, HTMLTableRowElement>['getVirtualItems']>[number];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  heightCell: number;
}

function TableBodyRow({ row, virtualRow, rowVirtualizer, heightCell }: TableBodyRowProps) {
  const { rowHeight } = useRowHeightStore();
  const lineCount = getLineCount(rowHeight);
  return (
    <tr
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      key={row.id}
      style={{
        display: 'flex',
        position: 'absolute',
        transform: `translateY(${virtualRow.start}px)`,
        width: '100%'
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            key={cell.id}
            className={cn(
              `flex justify-start  py-1.5 px-2  not-first:border-l border-t`,
              cell.column.getIsPinned() ? ' bg-background' : '',
              'size-full px-2 py-1.5 text-left text-xs outline-none has-data-[slot=checkbox]:pt-2.5  overflow-hidden',
              match(lineCount)
                .with(1, () => ' truncate line-clamp-1') // single line: still truncate
                .with(2, () => ' line-clamp-2') // allow word breaks for multiline
                .with(3, () => ' line-clamp-3')
                .with(4, () => ' line-clamp-4')
                .otherwise(() => ' truncate line-clamp-1')
            )}
            style={{
              ...getCommonPinningStyles(cell.column),
              minWidth: `calc(var(--col-${cell.column.id}-size) * 1px) `,
              flex: 1,
              height: heightCell - 6
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}

const TableBodyRowMemo = React.memo(TableBodyRow, (prev, next) => {
  // Only skip re-render if scrolling and the row index hasn't changed
  return next.rowVirtualizer.isScrolling && prev.virtualRow.index === next.virtualRow.index;
}) as typeof TableBodyRow;
