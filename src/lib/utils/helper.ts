import type { GridItem, BreakpointItem } from "../types.js";
import { makeMatrixFromItems } from "./matrix.js";
import { findFreeSpaceForItem, normalize, adjust, compactY } from "./item.js";
import { getRowsCount } from "./other.js";

type ItemInput = Partial<BreakpointItem> & { x: number; y: number; w: number; h: number };

function makeItem(item: ItemInput): BreakpointItem {
  const { min = { w: 1, h: 1 }, max, fixed = false } = item;
  return {
    fixed,
    resizable: !fixed,
    draggable: !fixed,
    customDragger: false,
    customResizer: false,
    min: { w: Math.max(1, min.w ?? 1), h: Math.max(1, min.h ?? 1) },
    max: max ? { ...max } : {},
    ...item,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  } as BreakpointItem;
}

/**
 * Encode drag data into a DragEvent so the Grid can read w/h during dragover.
 * Call this in your element's ondragstart handler.
 */
export function startGridDrag(e: DragEvent, w: number, h: number, data?: unknown): void {
  e.dataTransfer!.effectAllowed = "copy";
  // Encode w/h in MIME type so it's readable during dragover (browsers block values on dragover)
  e.dataTransfer!.setData(`application/svelte-grid+${w}x${h}`, data !== undefined ? JSON.stringify(data) : "");
}

export const gridHelp = {
  normalize(items: GridItem[], col: number): GridItem[] {
    return normalize(items, col);
  },

  adjust(items: GridItem[], col: number): GridItem[] {
    return adjust(items, col);
  },

  compact(items: GridItem[], col: number): GridItem[] {
    return compactY(items, col);
  },

  item(obj: ItemInput): BreakpointItem {
    return makeItem(obj);
  },

  findSpace(item: GridItem, items: GridItem[], cols: number): { x: number; y: number } {
    const matrix = makeMatrixFromItems(items, getRowsCount(items, cols), cols);
    const bp = item[cols];
    if (!bp) return { x: 0, y: 0 };
    return findFreeSpaceForItem(matrix, bp);
  },
};

export default gridHelp;
