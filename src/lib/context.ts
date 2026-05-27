/**
 * Svelte context for svelte-grid.
 *
 * Call `getGridContext()` inside any component that is rendered inside a Grid
 * snippet to access live grid metrics without prop-drilling.
 *
 * @example
 * ```svelte
 * <script>
 *   import { getGridContext } from 'svelte-grid';
 *   const grid = getGridContext();
 * </script>
 *
 * <!-- Inside a Grid snippet: -->
 * <p>Column width: {grid.xPerPx()}px</p>
 * <p>Read-only: {grid.readOnly()}</p>
 * ```
 */

import { getContext, setContext } from "svelte";

const GRID_CTX = Symbol("svelte-grid");

export interface GridContext {
  /** Pixels per column at the current breakpoint. */
  xPerPx: () => number;
  /** Pixels per row (= rowHeight). */
  yPerPx: () => number;
  /** Active column count at the current breakpoint. */
  cols: () => number;
  /** Horizontal gap between items in pixels. */
  gapX: () => number;
  /** Vertical gap between items in pixels. */
  gapY: () => number;
  /** Whether the grid is in read-only mode. */
  readOnly: () => boolean;
  /** Active collision behaviour. */
  collision: () => string;
}

/** @internal — called by Grid to publish its state. */
export function setGridContext(ctx: GridContext): void {
  setContext(GRID_CTX, ctx);
}

/**
 * Access the parent Grid's live metrics from inside a snippet widget.
 * Must be called during component initialisation (top-level `<script>`).
 * Returns `undefined` when called outside a Grid.
 */
export function getGridContext(): GridContext | undefined {
  return getContext<GridContext>(GRID_CTX);
}
