import type { GridItem } from "../types.js";
import { getRowsCount } from "./other.js";

/**
 * Calculate container height in pixels.
 * If `rows` is provided, the container will be at least that many rows tall.
 */
export function getContainerHeight(items: GridItem[], yPerPx: number, cols: number, rows = 0): number {
  const itemRows = getRowsCount(items, cols);
  return Math.max(itemRows, rows) * yPerPx;
}
