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

/** Payload for onexternaldrop. */
export interface ExternalDropEvent {
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  data: unknown;
}
