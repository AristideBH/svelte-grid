<script lang="ts">
  import type { Snippet } from "svelte";
  import type { BreakpointItem, ResizeDir } from "../types.js";

  interface RepaintEvent {
    id: string;
    shadow: Partial<BreakpointItem>;
    isPointerUp: boolean;
    onUpdate?: () => void;
  }

  interface Props {
    sensor: number;
    width: number;
    height: number;
    left: number;
    top: number;
    resizable: boolean | undefined;
    draggable: boolean | undefined;
    readOnly: boolean;
    rows: number;
    bounds: boolean;
    id: string;
    container: HTMLElement | undefined;
    xPerPx: number;
    yPerPx: number;
    gapX: number;
    gapY: number;
    item: BreakpointItem | undefined;
    max: BreakpointItem["max"];
    min: BreakpointItem["min"];
    cols: number;
    nativeContainer: HTMLElement | undefined;
    children: Snippet<[(e: PointerEvent) => void, (e: PointerEvent) => void]>;
    onrepaint?: (event: RepaintEvent) => void;
    onpointerup?: (event: { id: string }) => void;
    ondragstart?: (event: { id: string }) => void;
    onresizestart?: (event: { id: string }) => void;
  }

  let {
    sensor,
    width,
    height,
    left,
    top,
    resizable,
    draggable,
    readOnly,
    rows,
    bounds,
    id,
    container,
    xPerPx,
    yPerPx,
    gapX,
    gapY,
    item,
    max,
    min,
    cols,
    nativeContainer,
    children,
    onrepaint,
    onpointerup,
    ondragstart,
    onresizestart,
  }: Props = $props();

  // --- Reactive UI state ---
  let shadow = $state<Partial<BreakpointItem>>({});
  let active = $state(false);
  let trans = $state(false);
  let cordDiff = $state({ x: 0, y: 0 });
  let newSize = $state({ width: 0, height: 0 });
  let rect = $state<DOMRect | undefined>(undefined);
  let shadowElement = $state<HTMLElement | undefined>(undefined);
  let resizeOffset = $state({ x: 0, y: 0 });
  let currentResizeDir = $state<ResizeDir>("se");

  // --- Internal (non-reactive) state ---
  let initX = 0;
  let initY = 0;
  let capturePos = { x: 0, y: 0 };
  let _scrollTop = 0;
  let containerFrame = { top: 0, bottom: 0 };
  let scrollElement: Element | undefined = undefined;
  let anima: ReturnType<typeof setTimeout>;
  let resizeInitPos = { x: 0, y: 0 };
  let initSize = { width: 0, height: 0 };
  let sign = { x: 0, y: 0 };
  let vel = { x: 0, y: 0 };
  let intervalId: ReturnType<typeof setInterval> | false = false;

  // --- Computed style ---
  const itemStyle = $derived.by(() => {
    const w = active ? newSize.width : width;
    const h = active ? newSize.height : height;

    if (active && rect) {
      return `width: ${w}px; height: ${h}px; transform: translate(${cordDiff.x}px, ${cordDiff.y}px); top: ${rect.top + resizeOffset.y}px; left: ${rect.left + resizeOffset.x}px;`;
    } else if (trans) {
      return `width: ${w}px; height: ${h}px; transform: translate(${cordDiff.x}px, ${cordDiff.y}px); position: absolute; transition: width 0.2s, height 0.2s;`;
    } else {
      return `width: ${w}px; height: ${h}px; transition: transform 0.2s, opacity 0.2s; transform: translate(${left}px, ${top}px);`;
    }
  });

  // --- Helpers ---
  const getContainerFrame = (el: HTMLElement | undefined) => {
    if (!el || el === document.documentElement) {
      const { top, bottom } = nativeContainer?.getBoundingClientRect() ?? { top: 0, bottom: window.innerHeight };
      return { top: Math.max(0, top), bottom: Math.min(window.innerHeight, bottom) };
    }
    return el.getBoundingClientRect();
  };

  const getScroller = (el: HTMLElement | undefined): Element => (!el ? document.documentElement : el);
  const getScrollTop = (): number => (scrollElement ? (scrollElement as HTMLElement).scrollTop : 0);

  const repaint = (cb?: () => void, isPointerUp = false) => {
    onrepaint?.({ id, shadow, isPointerUp, onUpdate: cb });
  };

  const inActivate = () => {
    if (!shadowElement || !rect) return;
    const shadowBound = shadowElement.getBoundingClientRect();
    const xdragBound = rect.left + cordDiff.x + resizeOffset.x;
    const ydragBound = rect.top + cordDiff.y + resizeOffset.y;

    cordDiff.x = (shadow.x ?? 0) * xPerPx + gapX - (shadowBound.x - xdragBound);
    cordDiff.y = (shadow.y ?? 0) * yPerPx + gapY - (shadowBound.y - ydragBound);

    active = false;
    trans = true;
    resizeOffset = { x: 0, y: 0 };

    clearTimeout(anima);
    anima = setTimeout(() => {
      trans = false;
    }, 100);

    onpointerup?.({ id });
  };

  // --- Autoscroll ---
  const stopAutoscroll = () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = false;
    sign = { x: 0, y: 0 };
    vel = { x: 0, y: 0 };
  };

  const update = () => {
    const scrollDelta = getScrollTop() - _scrollTop;
    const boundX = capturePos.x + cordDiff.x;
    const boundY = capturePos.y + cordDiff.y + scrollDelta;

    shadow.x = Math.max(Math.min(Math.round(boundX / xPerPx), cols - (shadow.w ?? 1)), 0);
    shadow.y = Math.max(Math.round(boundY / yPerPx), 0);
    if (max?.y) shadow.y = Math.min(shadow.y, max.y);

    // Clamp to row boundary when bounds is enabled
    if (bounds && rows > 0 && shadow.h !== undefined) {
      shadow.y = Math.min(shadow.y, Math.max(0, rows - shadow.h));
    }

    repaint();
  };

  // --- Drag ---
  const pointermove = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const { clientX, clientY } = event;
    cordDiff = { x: clientX - initX, y: clientY - initY };

    const velocityTop = Math.max(0, (containerFrame.top + sensor - clientY) / sensor);
    const velocityBottom = Math.max(0, (clientY - (containerFrame.bottom - sensor)) / sensor);

    sign.y = velocityTop > 0 && velocityBottom === 0 ? -1 : velocityBottom > 0 && velocityTop === 0 ? 1 : 0;
    vel.y = sign.y === -1 ? velocityTop : velocityBottom;

    if (vel.y > 0) {
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (scrollElement) (scrollElement as HTMLElement).scrollTop += 2 * (vel.y + Math.sign(vel.y)) * sign.y;
          update();
        }, 10);
      }
    } else if (intervalId) {
      stopAutoscroll();
    } else {
      update();
    }
  };

  const pointerup = () => {
    stopAutoscroll();
    window.removeEventListener("pointermove", pointermove);
    window.removeEventListener("pointerup", pointerup);
    repaint(inActivate, true);
  };

  const pointerdown = ({ clientX, clientY, target }: PointerEvent) => {
    if (readOnly) return;
    initX = clientX;
    initY = clientY;

    capturePos = { x: left, y: top };
    shadow = { x: item?.x ?? 0, y: item?.y ?? 0, w: item?.w ?? 1, h: item?.h ?? 1 };
    newSize = { width, height };

    containerFrame = getContainerFrame(container);
    scrollElement = getScroller(container);

    cordDiff = { x: 0, y: 0 };
    resizeOffset = { x: 0, y: 0 };
    rect = (target as HTMLElement).closest(".svlt-grid-item")?.getBoundingClientRect();

    active = true;
    trans = false;
    _scrollTop = getScrollTop();

    ondragstart?.({ id });

    window.addEventListener("pointermove", pointermove);
    window.addEventListener("pointerup", pointerup);
  };

  // --- Resize ---
  const resizePointerMove = ({ pageX, pageY }: PointerEvent) => {
    const dx = pageX - resizeInitPos.x;
    const dy = pageY - resizeInitPos.y;
    const dir = currentResizeDir;
    const isW = dir.includes("w"),
      isN = dir.includes("n");
    const isE = dir.includes("e"),
      isS = dir.includes("s");

    const rawW = initSize.width + (isE ? dx : isW ? -dx : 0);
    const rawH = initSize.height + (isS ? dy : isN ? -dy : 0);

    const rightEdgeCols = (item?.x ?? 0) + (item?.w ?? 1);
    const maxWCols = isW ? rightEdgeCols : cols - (item?.x ?? 0);
    const maxW = max?.w ? Math.min(max.w, maxWCols) : maxWCols;
    const minW = min?.w ?? 1;
    newSize.width = Math.max(Math.min(rawW, maxW * xPerPx - gapX * 2), minW * xPerPx - gapX * 2);

    const bottomEdgeCols = (item?.y ?? 0) + (item?.h ?? 1);
    const minH = min?.h ?? 1;
    newSize.height = Math.max(rawH, minH * yPerPx - gapY * 2);
    if (isN) newSize.height = Math.min(newSize.height, bottomEdgeCols * yPerPx - gapY * 2);
    if (max?.h) newSize.height = Math.min(newSize.height, max.h * yPerPx - gapY * 2);

    resizeOffset.x = isW ? initSize.width - newSize.width : 0;
    resizeOffset.y = isN ? initSize.height - newSize.height : 0;

    shadow.w = Math.round((newSize.width + gapX * 2) / xPerPx);
    shadow.h = Math.round((newSize.height + gapY * 2) / yPerPx);
    if (isW) shadow.x = Math.max(0, rightEdgeCols - shadow.w);
    if (isN) shadow.y = Math.max(0, bottomEdgeCols - shadow.h);

    // Clamp to row boundary when bounds is enabled
    if (bounds && rows > 0) {
      const maxH = rows - (shadow.y ?? 0);
      if ((shadow.h ?? 1) > maxH) {
        shadow.h = Math.max(min?.h ?? 1, maxH);
        newSize.height = shadow.h * yPerPx - gapY * 2;
      }
    }

    repaint();
  };

  const resizePointerUp = (e: PointerEvent) => {
    e.stopPropagation();
    repaint(inActivate, true);
    window.removeEventListener("pointermove", resizePointerMove);
    window.removeEventListener("pointerup", resizePointerUp);
  };

  const resizePointerDown = (e: PointerEvent, dir: ResizeDir = "se") => {
    if (readOnly) return;
    e.stopPropagation();

    currentResizeDir = dir;
    resizeInitPos = { x: e.pageX, y: e.pageY };
    initSize = { width, height };
    cordDiff = { x: 0, y: 0 };
    resizeOffset = { x: 0, y: 0 };
    rect = (e.target as HTMLElement).closest(".svlt-grid-item")?.getBoundingClientRect();
    newSize = { width, height };
    active = true;
    trans = false;
    shadow = { x: item?.x ?? 0, y: item?.y ?? 0, w: item?.w ?? 1, h: item?.h ?? 1 };

    containerFrame = getContainerFrame(container);
    scrollElement = getScroller(container);

    onresizestart?.({ id });

    window.addEventListener("pointermove", resizePointerMove);
    window.addEventListener("pointerup", resizePointerUp);
  };

  // Exposed to snippet — SE only, matching original API
  const resizePointerDownSE = (e: PointerEvent) => resizePointerDown(e, "se");

  // --- Keyboard ---
  const keydown = (e: KeyboardEvent) => {
    if (readOnly || !item) return;
    const arrows = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!arrows.includes(e.key)) return;
    e.preventDefault();

    const x = item.x ?? 0,
      y = item.y ?? 0,
      w = item.w ?? 1,
      h = item.h ?? 1;

    if (e.shiftKey && resizable) {
      const newW =
        e.key === "ArrowRight" ? Math.min(cols - x, w + 1) : e.key === "ArrowLeft" ? Math.max(min?.w ?? 1, w - 1) : w;
      const newH = e.key === "ArrowDown" ? h + 1 : e.key === "ArrowUp" ? Math.max(min?.h ?? 1, h - 1) : h;
      if (newW === w && newH === h) return;
      shadow = { x, y, w: newW, h: newH };
    } else if (draggable) {
      const newX = e.key === "ArrowLeft" ? Math.max(0, x - 1) : e.key === "ArrowRight" ? Math.min(cols - w, x + 1) : x;
      const newY = e.key === "ArrowUp" ? Math.max(0, y - 1) : e.key === "ArrowDown" ? y + 1 : y;
      if (newX === x && newY === y) return;
      shadow = { x: newX, y: newY, w, h };
    } else {
      return;
    }

    onrepaint?.({ id, shadow, isPointerUp: true });
    onpointerup?.({ id });
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  draggable={false}
  onpointerdown={!item?.customDragger && draggable ? pointerdown : undefined}
  onkeydown={keydown}
  tabindex={draggable || resizable ? 0 : undefined}
  role="button"
  aria-label="Grid item — arrows to move, Shift+arrows to resize"
  class="svlt-grid-item"
  class:svlt-grid-active={active || (trans && rect)}
  class:svlt-grid-item--draggable={!item?.customDragger && draggable && !readOnly}
  style={itemStyle}
>
  {@render children(pointerdown, resizePointerDownSE)}
  {#if resizable && !item?.customResizer}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--se" onpointerdown={(e) => resizePointerDown(e, "se")}></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--sw" onpointerdown={(e) => resizePointerDown(e, "sw")}></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--ne" onpointerdown={(e) => resizePointerDown(e, "ne")}></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--nw" onpointerdown={(e) => resizePointerDown(e, "nw")}></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--n" onpointerdown={(e) => resizePointerDown(e, "n")}></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--s" onpointerdown={(e) => resizePointerDown(e, "s")}></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--e" onpointerdown={(e) => resizePointerDown(e, "e")}></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="svlt-grid-resizer svlt-grid-resizer--w" onpointerdown={(e) => resizePointerDown(e, "w")}></div>
  {/if}
</div>

{#if active || trans}
  <div
    class="svlt-grid-shadow shadow-active"
    style="width: {(shadow.w ?? 0) * xPerPx - gapX * 2}px; height: {(shadow.h ?? 0) * yPerPx -
      gapY * 2}px; transform: translate({(shadow.x ?? 0) * xPerPx + gapX}px, {(shadow.y ?? 0) * yPerPx + gapY}px);"
    bind:this={shadowElement}
  ></div>
{/if}

<style>
  /*
   * ─── CSS Custom Properties ───────────────────────────────────────────────────
   *
   * All visual tokens are exposed as custom properties so consumers can theme
   * the grid without :global() hacks.  Override them on .svlt-grid-container
   * (or any ancestor) to apply a custom theme.
   *
   * Tailwind / shadcn-svelte example:
   *   :global(.svlt-grid-container) {
   *     --svlt-shadow-bg:      hsl(var(--muted));
   *     --svlt-shadow-radius:  var(--radius);
   *     --svlt-focus-ring:     hsl(var(--ring));
   *     --svlt-handle-color:   hsl(var(--muted-foreground));
   *   }
   *
   * When the grid prop `unstyled={true}` is set, the container gains the class
   * `.svlt-unstyled` and all cosmetic defaults below are suppressed so you can
   * apply your own styles via Tailwind utilities or arbitrary CSS.
   */

  /* ── Functional (always applied, even with unstyled) ── */
  .svlt-grid-item {
    touch-action: none;
    position: absolute;
    will-change: auto;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    outline: none;
  }

  .svlt-grid-resizer {
    user-select: none;
    position: absolute;
    z-index: var(--svlt-handle-z, 4);
  }

  /* Corner handles */
  .svlt-grid-resizer--se { right:  0; bottom: 0; cursor: se-resize; width:  var(--svlt-handle-corner, 20px); height: var(--svlt-handle-corner, 20px); }
  .svlt-grid-resizer--sw { left:   0; bottom: 0; cursor: sw-resize; width:  var(--svlt-handle-corner, 20px); height: var(--svlt-handle-corner, 20px); }
  .svlt-grid-resizer--ne { right:  0; top:    0; cursor: ne-resize; width:  var(--svlt-handle-corner, 20px); height: var(--svlt-handle-corner, 20px); }
  .svlt-grid-resizer--nw { left:   0; top:    0; cursor: nw-resize; width:  var(--svlt-handle-corner, 20px); height: var(--svlt-handle-corner, 20px); }

  /* Edge handles — inset past the corner handles so they don't overlap */
  .svlt-grid-resizer--n {
    height: var(--svlt-handle-edge, 8px);
    left:   var(--svlt-handle-corner, 20px);
    right:  var(--svlt-handle-corner, 20px);
    top: 0;
    cursor: n-resize;
  }
  .svlt-grid-resizer--s {
    height: var(--svlt-handle-edge, 8px);
    left:   var(--svlt-handle-corner, 20px);
    right:  var(--svlt-handle-corner, 20px);
    bottom: 0;
    cursor: s-resize;
  }
  .svlt-grid-resizer--e {
    width:  var(--svlt-handle-edge, 8px);
    top:    var(--svlt-handle-corner, 20px);
    bottom: var(--svlt-handle-corner, 20px);
    right: 0;
    cursor: e-resize;
  }
  .svlt-grid-resizer--w {
    width:  var(--svlt-handle-edge, 8px);
    top:    var(--svlt-handle-corner, 20px);
    bottom: var(--svlt-handle-corner, 20px);
    left: 0;
    cursor: w-resize;
  }

  .svlt-grid-active {
    z-index: var(--svlt-active-z, 3);
    cursor: var(--svlt-cursor-grabbing, grabbing);
    position: fixed;
    opacity: var(--svlt-active-opacity, 0.5);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    user-select: none;
  }

  .shadow-active {
    z-index: 2;
    transition: all 0.2s;
  }

  .svlt-grid-shadow {
    position: absolute;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /* ── Cosmetic defaults (suppressed when .svlt-unstyled is on the container) ── */
  :global(:not(.svlt-unstyled)) > .svlt-grid-item:focus-visible {
    outline: 2px solid var(--svlt-focus-ring, #4a90e2);
    outline-offset: 2px;
    z-index: 1;
  }

  :global(:not(.svlt-unstyled)) .svlt-grid-item--draggable {
    cursor: var(--svlt-cursor-grab, grab);
  }

  :global(:not(.svlt-unstyled)) .svlt-grid-resizer--se::after {
    content: "";
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 5px;
    height: 5px;
    border-right: 2px solid var(--svlt-handle-color, rgba(0, 0, 0, 0.4));
    border-bottom: 2px solid var(--svlt-handle-color, rgba(0, 0, 0, 0.4));
  }

  :global(:not(.svlt-unstyled)) .svlt-grid-shadow {
    background: var(--svlt-shadow-bg, rgba(0, 0, 0, 0.15));
    border-radius: var(--svlt-shadow-radius, 0px);
  }
</style>
