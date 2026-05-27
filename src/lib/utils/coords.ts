import type { BreakpointItem, PixelRect, GridRect } from "../types.js";

/**
 * Convert a grid item's position/size to absolute pixel values within the container.
 *
 * Gap semantics match the CSS `gap` convention: gapX/2 is applied to each side of an item,
 * but the outer edges (x=0, y=0, x+w=cols) receive no gap so there is zero outer padding.
 *
 * @param item      BreakpointItem with x, y, w, h in grid units
 * @param xPerPx    Pixels per column  (containerWidth / cols)
 * @param yPerPx    Pixels per row     (rowHeight)
 * @param gapX      Horizontal gap between items (full gap, not half)
 * @param gapY      Vertical gap between items   (full gap, not half)
 * @param cols      Total number of columns (required for correct right-edge detection)
 */
export function gridToPixel(
  item: Pick<BreakpointItem, "x" | "y" | "w" | "h">,
  xPerPx: number,
  yPerPx: number,
  gapX: number,
  gapY: number,
  cols?: number,
): PixelRect {
  const gl = item.x > 0 ? gapX / 2 : 0;
  const gr = cols !== undefined && item.x + item.w < cols ? gapX / 2 : gapX / 2;
  const gt = item.y > 0 ? gapY / 2 : 0;
  const gb = gapY / 2;
  return {
    x: item.x * xPerPx + gl,
    y: item.y * yPerPx + gt,
    width: item.w * xPerPx - gl - gr,
    height: item.h * yPerPx - gt - gb,
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
    x: Math.round(px.x / xPerPx),
    y: Math.round(px.y / yPerPx),
    w: Math.round((px.width + gapX) / xPerPx),
    h: Math.round((px.height + gapY) / yPerPx),
  };
}
