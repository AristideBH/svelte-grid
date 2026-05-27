import type { GridItem, GridControllerInterface, NewItemInput } from "./types.js";
import { compactY, findFreeSpaceForItem } from "./utils/item.js";
import { makeMatrixFromItems } from "./utils/matrix.js";
import { getRowsCount } from "./utils/other.js";

/**
 * Programmatic controller for the Grid component.
 * Obtain an instance via `bind:controller` on the Grid.
 *
 * @example
 * ```svelte
 * <script>
 *   import Grid, { GridController } from 'svelte-grid';
 *   let controller = $state<GridController>();
 * </script>
 * <Grid bind:controller bind:items {cols} {rowHeight}>...</Grid>
 * <button onclick={() => controller?.addItem({ w: 2, h: 2 })}>Add</button>
 * ```
 */
export class GridController implements GridControllerInterface {
  readonly #getItems: () => GridItem[];
  readonly #setItems: (items: GridItem[]) => void;
  readonly #getCols: () => number;

  constructor(
    getItems: () => GridItem[],
    setItems: (items: GridItem[]) => void,
    getCols: () => number,
  ) {
    this.#getItems = getItems;
    this.#setItems = setItems;
    this.#getCols = getCols;
  }

  /**
   * Find the first available (x, y) position that fits an item of the given size.
   * Returns `null` if the grid is somehow full (extremely unlikely with dynamic rows).
   */
  getFirstAvailablePosition(w: number, h: number): { x: number; y: number } | null {
    const cols = this.#getCols();
    const items = this.#getItems();
    // Add extra rows to ensure we always find a free spot below existing content
    const rowCount = getRowsCount(items, cols) + h;
    const matrix = makeMatrixFromItems(items, rowCount, cols);
    const pos = findFreeSpaceForItem(matrix, { x: 0, y: 0, w, h });
    return pos ?? null;
  }

  /**
   * Compact all items upward, removing empty rows.
   * Equivalent to calling `gridHelp.compact(items, cols)` manually.
   */
  compress(): void {
    const cols = this.#getCols();
    this.#setItems(compactY(this.#getItems(), cols));
  }

  /**
   * Add a new item to the grid.
   * If `x` and `y` are not provided, the item is placed at the first available position.
   */
  addItem(input: NewItemInput): void {
    const cols = this.#getCols();
    const items = this.#getItems();

    const pos =
      input.x !== undefined && input.y !== undefined
        ? { x: input.x, y: input.y }
        : (this.getFirstAvailablePosition(input.w, input.h) ?? { x: 0, y: 0 });

    const id = input.id ?? crypto.randomUUID();

    const newItem: GridItem = {
      id,
      data: input.data,
      [cols]: {
        x: pos.x,
        y: pos.y,
        w: input.w,
        h: input.h,
        draggable: true,
        resizable: true,
        fixed: false,
        customDragger: false,
        customResizer: false,
        min: { w: 1, h: 1 },
        max: {},
      },
    };

    this.#setItems([...items, newItem]);
  }
}
