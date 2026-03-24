import { cn } from '@/lib/utils';
import { memo, type ReactNode } from 'react';

export const TableCellCostume = memo(function TableCellCostume({
  children,
  className: c
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <span data-slot="grid-cell-content" className={cn('font-source-code-pro', c)}>
      {formatCellValue(children)}
    </span>
  );
});

function formatCellValue(value: ReactNode): ReactNode {
  if (value === null) return <span className="text-muted-foreground">[NULL]</span>;
  if (value === undefined) return 'UNDEFINED';
  if (typeof value === 'boolean') {
    return value ? <span className="text-primary">TRUE</span> : <span className="text-destructive">FALSE</span>;
  }
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'NaN';
    if (value === Infinity) return 'Infinity';
    if (value === -Infinity) return '-Infinity';
  }
  return String(value);
}
