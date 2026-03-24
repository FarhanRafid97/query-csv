type RowHeightValue = 'short' | 'medium' | 'tall' | 'extra-tall';
export function getRowHeightValue(rowHeight: RowHeightValue): number {
  const rowHeightMap: Record<RowHeightValue, number> = {
    short: 28,
    medium: 56,
    tall: 76,
    'extra-tall': 96
  };

  return rowHeightMap[rowHeight];
}

export function getLineCount(rowHeight: RowHeightValue): number {
  const lineCountMap: Record<RowHeightValue, number> = {
    short: 1,
    medium: 2,
    tall: 3,
    'extra-tall': 4
  };

  return lineCountMap[rowHeight];
}
