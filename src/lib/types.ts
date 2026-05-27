export interface BreakpointItem {
  x: number;
  y: number;
  w: number;
  h: number;
  fixed?: boolean;
  static?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  customDragger?: boolean;
  customResizer?: boolean;
  min?: { w?: number; h?: number };
  max?: { w?: number; h?: number; y?: number };
}

export interface GridItem<TData = unknown> {
  id: string;
  data?: TData;
  [cols: number]: BreakpointItem | undefined;
}

/** Array of [maxContainerWidth, columnCount] tuples, sorted descending by width. */
export type ColsDefinition = [maxWidth: number, cols: number][];

/** [gapX, gapY] in pixels. */
export type Gap = [gapX: number, gapY: number];

/** Direction of a resize handle. */
export type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/**
 * How items behave when a dragged item overlaps them.
 *
 * - `"push"` (default) — overlapping items are pushed to the nearest free space.
 * - `"none"` — items may freely overlap; only the dragged item moves.
 * - `"compress"` — like push, but all items are also compacted upward after each move.
 */
export type CollisionBehavior = "push" | "none" | "compress";

/** Payload for onexternaldrop. */
export interface ExternalDropEvent {
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  data: unknown;
}

/** Programmatic controller interface exposed via bind:controller. */
export interface GridControllerInterface {
  getFirstAvailablePosition(w: number, h: number): { x: number; y: number } | null;
  compress(): void;
  addItem(input: NewItemInput): void;
}

/** Input for GridController.addItem(). */
export interface NewItemInput {
  id?: string;
  data?: unknown;
  w: number;
  h: number;
  x?: number;
  y?: number;
}

/** A rectangle in pixel space. */
export interface PixelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A rectangle in grid units. */
export interface GridRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
