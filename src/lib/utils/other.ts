import type { GridItem, ColsDefinition } from "../types.js";

export function throttle<T extends unknown[]>(func: (...args: T) => void, timeFrame: number): (...args: T) => void {
  let lastTime = 0;
  return function (...args: T) {
    const now = Date.now();
    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}

export function getRowsCount(items: GridItem[], cols: number): number {
  const heights = items.map((val) => {
    const item = val[cols];
    return (item?.y ?? 0) + (item?.h ?? 0);
  });
  return Math.max(...heights, 1);
}

export function getColumn(containerWidth: number, columns: ColsDefinition): number {
  const sorted = columns.slice().sort((a, b) => a[0] - b[0]);
  const breakpoint = sorted.find(([width]) => containerWidth <= width);
  return breakpoint ? breakpoint[1] : sorted[sorted.length - 1][1];
}
