import type { GridItem } from "../types.js";
import { getRowsCount } from "./other.js";

export function getContainerHeight(items: GridItem[], yPerPx: number, cols: number): number {
  return getRowsCount(items, cols) * yPerPx;
}
