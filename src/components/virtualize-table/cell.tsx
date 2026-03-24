import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { match } from 'ts-pattern';

export const TableCellCostume = ({
  children,
  className: c
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) => {
  return (
    <span data-slot="grid-cell-content" className={cn(' font-source-code-pro', c)}>
      {match(children)
        .with(null, () => <span className="text-muted-foreground">{`[NULL]`}</span>)
        .with(undefined, () => 'UNDEFINED')
        .with(NaN, () => 'NaN')
        .with(Infinity, () => 'Infinity')
        .with(-Infinity, () => '-Infinity')
        .with(0, () => '0')
        .with(1, () => '1')
        .otherwise(() =>
          match(typeof children)
            .with('boolean', () =>
              match(children)
                .with(true, () => <span className="text-primary">TRUE</span>)
                .with(false, () => <span className="text-destructive">FALSE</span>)
                .otherwise(() => children)
            )
            .otherwise(() => children)
        )}
    </span>
  );
};
