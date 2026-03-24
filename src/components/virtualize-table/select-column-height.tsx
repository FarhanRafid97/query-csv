'use client';

import { AlignVerticalSpaceAroundIcon, ChevronsDownUpIcon, EqualIcon, MinusIcon } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRowHeightStore } from '@/store/row-height';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const rowHeights = [
  {
    label: 'Short',
    value: 'short' as const,
    icon: MinusIcon
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: EqualIcon
  },
  {
    label: 'Tall',
    value: 'tall' as const,
    icon: AlignVerticalSpaceAroundIcon
  },
  {
    label: 'Extra Tall',
    value: 'extra-tall' as const,
    icon: ChevronsDownUpIcon
  }
] as const;

export function DataGridRowHeightMenu() {
  const { rowHeight, setRowHeight } = useRowHeightStore();

  return (
    <ToggleGroup
      type="single"
      value={rowHeight}
      onValueChange={(value) => {
        if (value) setRowHeight(value as 'short' | 'medium' | 'tall' | 'extra-tall');
      }}
      variant="outline"
      size="sm"
    >
      {rowHeights.map((option) => {
        const OptionIcon = option.icon;
        return (
          <Tooltip key={option.value} delayDuration={300}>
            <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
              <ToggleGroupItem
                value={option.value}
                aria-label={option.label}
                className={cn('focus:ring-0 focus:ring-offset-0', rowHeight === option.value ? 'bg-secondary' : '')}
              >
                <OptionIcon className="size-3" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </ToggleGroup>
  );
}
