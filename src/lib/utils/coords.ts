import type { BreakpointItem, PixelRect, GridRect } from "../types.js";

/**
 * Convert a grid item's position/size to absolute pixel values within the container.
 *
 * @param item      BreakpointItem with x, y, w, h in grid units
 * @param xPerPx    Pixels per column
 * @param yPerPx    Pixels per row (rowHeight)
 * @param gapX      Horizontal gap between items
 * @param gapY      Vertical gap between items
 */
export function gridToPixel(
  item: Pick<BreakpointItem, "x" | "y" | "w" | "h">,
  xPerPx: number,
  yPerPx: number,
  gapX: number,
  gapY: number,
): PixelRect {
  return {
    x: item.x * xPerPx + gapX,
    y: item.y * yPerPx + gapY,
    width: item.w * xPerPx - gapX * 2,
    height: item.h * yPerPx - gapY * 2,
  };
}

/**
 * Convert pixel coordinates (relative to the grid container) back to grid units.
 *
 * @param px        Pixel rectangle relative to container top-left
 * @param xPerPx    Pixels per column
 * @param yPerPx    Pixels per row (rowHeight)
 * @param gapX      Horizontal gap between items
 * @param gapY      Vertical gap between items
 */
export function pixelToGrid(
  px: PixelRect,
  xPerPx: number,
  yPerPx: number,
  gapX: number,
  gapY: number,
): GridRect {
  return {
    x: Math.round((px.x - gapX) / xPerPx),
    y: Math.round((px.y - gapY) / yPerPx),
    w: Math.round((px.width + gapX * 2) / xPerPx),
    h: Math.round((px.height + gapY * 2) / yPerPx),
  };
}
