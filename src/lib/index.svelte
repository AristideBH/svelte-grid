<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import type { GridItem, BreakpointItem, ColsDefinition, Gap, ExternalDropEvent } from "./types.js";
  import { GridController } from "./GridController.svelte.js";
  import { getContainerHeight } from "./utils/container.js";
  import { moveItemsAroundItem, moveItem, getItemById, specifyUndefinedColumns, compactY } from "./utils/item.js";
  import { getColumn } from "./utils/other.js";
  import MoveResize from "./MoveResize/index.svelte";

  export interface SnippetArgs {
    movePointerDown: (e: PointerEvent) => void;
    resizePointerDown: (e: PointerEvent) => void;
    dataItem: GridItem;
    item: BreakpointItem;
    index: number;
  }

  interface MountEvent   { cols: number; xPerPx: number; yPerPx: number; }
  interface ResizeEvent  { cols: number; xPerPx: number; yPerPx: number; width: number; }
  interface ChangeEvent  { unsafeItem: GridItem; id: string; cols: number; }
  interface PointerUpEvent { id: string; cols: number; }
  interface DragStartEvent { id: string; cols: number; }
  interface ResizeStartEvent { id: string; cols: number; }

  interface Props {
    fillSpace?: boolean;
    items: GridItem[];
    rowHeight: number;
    cols: ColsDefinition;
    gap?: Gap;
    fastStart?: boolean;
    throttleUpdate?: number;
    throttleResize?: number;
    scroller?: HTMLElement;
    sensor?: number;
    compact?: boolean;
    /** Disable all drag and resize interactions globally. */
    readOnly?: boolean;
    /** Minimum number of rows to show (also used with `bounds` to cap item movement). */
    rows?: number;
    /** Prevent items from being dragged or resized beyond the `rows` boundary. */
    bounds?: boolean;
    /** Expose a programmatic controller. Use with `bind:controller`. */
    controller?: GridController;
    /** Automatically compact items upward whenever `items` changes externally. */
    autoCompress?: boolean;
    children: Snippet<[SnippetArgs]>;
    onmount?: (event: MountEvent) => void;
    onresize?: (event: ResizeEvent) => void;
    onchange?: (event: ChangeEvent) => void;
    onpointerup?: (event: PointerUpEvent) => void;
    ondragstart?: (event: DragStartEvent) => void;
    onresizestart?: (event: ResizeStartEvent) => void;
    onexternaldrop?: (event: ExternalDropEvent) => void;
  }

  let {
    fillSpace = false,
    items = $bindable([]),
    rowHeight,
    cols,
    gap = [10, 10],
    fastStart = false,
    throttleUpdate = 100,
    throttleResize = 100,
    scroller = undefined,
    sensor = 20,
    compact = false,
    readOnly = false,
    rows = 0,
    bounds = false,
    controller = $bindable<GridController | undefined>(undefined),
    autoCompress = false,
    children: renderItem,
    onmount,
    onresize,
    onchange,
    onpointerup,
    ondragstart,
    onresizestart,
    onexternaldrop,
  }: Props = $props();

  // --- Reactive state ---
  let getComputedCols = $state(0);
  let container = $state<HTMLElement | undefined>(undefined);
  let xPerPx = $state(0);
  let containerWidth = $state<number | undefined>(undefined);

  // External drag state
  let extDragItem = $state<{ x: number; y: number; w: number; h: number } | null>(null);

  // --- Derived ---
  const gapX = $derived(gap[0]);
  const gapY = $derived(gap[1]);
  const yPerPx = $derived(rowHeight);
  const containerHeight = $derived(getContainerHeight(items, yPerPx, getComputedCols, rows));

  // --- GridController wiring ---
  $effect(() => {
    controller = new GridController(
      () => items,
      (newItems) => { items = newItems; },
      () => getComputedCols,
    );
  });

  // --- autoCompress: compact items whenever they change externally ---
  // Guard against infinite loops: skip when the change came from us.
  let _internalItems = $state<GridItem[] | null>(null);
  $effect(() => {
    if (!autoCompress) return;
    const current = items;
    if (current === _internalItems) return;
    if (!getComputedCols) return;
    const compressed = compactY(current, getComputedCols);
    _internalItems = compressed;
    items = compressed;
  });

  // --- Event handlers ---
  const handlePointerUp = ({ id }: { id: string }) => {
    onpointerup?.({ id, cols: getComputedCols });
  };

  const handleDragStart = ({ id }: { id: string }) => {
    ondragstart?.({ id, cols: getComputedCols });
  };

  const handleResizeStart = ({ id }: { id: string }) => {
    onresizestart?.({ id, cols: getComputedCols });
  };

  let _lastResize = 0;
  const onResize = () => {
    const now = Date.now();
    if (now - _lastResize < throttleUpdate) return;
    _lastResize = now;
    items = specifyUndefinedColumns(items, getComputedCols, cols);
    onresize?.({ cols: getComputedCols, xPerPx, yPerPx, width: containerWidth ?? 0 });
  };

  const updateMatrix = ({ id: itemId, shadow, onUpdate }: { id: string; shadow: Partial<BreakpointItem>; isPointerUp: boolean; onUpdate?: () => void }) => {
    const found = getItemById(itemId, items);
    if (!found) return;

    const activeItem: GridItem = {
      ...found,
      [getComputedCols]: {
        ...(found[getComputedCols] as BreakpointItem),
        ...shadow,
      },
    };

    if (fillSpace) {
      items = moveItemsAroundItem(activeItem, items, getComputedCols, found);
    } else {
      items = moveItem(activeItem, items, getComputedCols, found);
    }

    if (compact) {
      items = compactY(items, getComputedCols);
    }

    onUpdate?.();

    onchange?.({ unsafeItem: activeItem, id: activeItem.id, cols: getComputedCols });
  };

  let _lastMatrix = 0;
  const throttledUpdateMatrix = (event: { id: string; shadow: Partial<BreakpointItem>; isPointerUp: boolean; onUpdate?: () => void }) => {
    const now = Date.now();
    if (now - _lastMatrix < throttleResize) return;
    _lastMatrix = now;
    updateMatrix(event);
  };

  const handleRepaint = (event: { id: string; shadow: Partial<BreakpointItem>; isPointerUp: boolean; onUpdate?: () => void }) => {
    if (!event.isPointerUp) {
      throttledUpdateMatrix(event);
    } else {
      updateMatrix(event);
    }
  };

  // --- External drag ---
  const handleDragOver = (e: DragEvent) => {
    if (!onexternaldrop) return;
    const mime = Array.from(e.dataTransfer?.types ?? []).find((t) => t.startsWith("application/svelte-grid+"));
    if (!mime) return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = "copy";

    const dims = mime.split("+")[1] ?? "1x1";
    const [w, h] = dims.split("x").map(Number);
    const containerRect = container?.getBoundingClientRect();
    if (!containerRect || !xPerPx) return;

    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    const x = Math.max(0, Math.min(Math.round(mouseX / xPerPx - w / 2), getComputedCols - w));
    const y = Math.max(0, Math.round(mouseY / yPerPx - h / 2));
    extDragItem = { x, y, w, h };
  };

  const handleDragLeave = (e: DragEvent) => {
    if (container && !container.contains(e.relatedTarget as Node)) {
      extDragItem = null;
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (!extDragItem) return;
    const mime = Array.from(e.dataTransfer?.types ?? []).find((t) => t.startsWith("application/svelte-grid+"));
    let data: unknown;
    if (mime) {
      try { data = JSON.parse(e.dataTransfer!.getData(mime)); } catch { data = undefined; }
    }
    onexternaldrop?.({ ...extDragItem, cols: getComputedCols, data });
    extDragItem = null;
  };

  onMount(() => {
    const sizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        const width = entries[0].contentRect.width;
        if (width === containerWidth) return;

        getComputedCols = getColumn(width, cols);
        xPerPx = width / getComputedCols;

        if (!containerWidth) {
          items = specifyUndefinedColumns(items, getComputedCols, cols);
          onmount?.({ cols: getComputedCols, xPerPx, yPerPx });
        } else {
          onResize();
        }

        containerWidth = width;
      });
    });

    if (container) sizeObserver.observe(container);
    return () => sizeObserver.disconnect();
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="svlt-grid-container"
  style="height: {containerHeight}px"
  bind:this={container}
  role={onexternaldrop ? "region" : undefined}
  aria-label={onexternaldrop ? "Grid drop zone" : undefined}
  ondragover={onexternaldrop ? handleDragOver : undefined}
  ondragleave={onexternaldrop ? handleDragLeave : undefined}
  ondrop={onexternaldrop ? handleDrop : undefined}
>
  {#if xPerPx || !fastStart}
    {#each items as item, i (item.id)}
      {@const bp = item[getComputedCols]}
      <MoveResize
        onrepaint={handleRepaint}
        onpointerup={handlePointerUp}
        ondragstart={handleDragStart}
        onresizestart={handleResizeStart}
        id={item.id}
        resizable={readOnly ? false : bp?.resizable}
        draggable={readOnly ? false : bp?.draggable}
        {readOnly}
        {rows}
        {bounds}
        {xPerPx}
        yPerPx={yPerPx}
        width={Math.min(getComputedCols, bp?.w ?? 0) * xPerPx - gapX * 2}
        height={(bp?.h ?? 0) * yPerPx - gapY * 2}
        top={(bp?.y ?? 0) * yPerPx + gapY}
        left={(bp?.x ?? 0) * xPerPx + gapX}
        item={bp}
        min={bp?.min}
        max={bp?.max}
        cols={getComputedCols}
        {gapX}
        {gapY}
        {sensor}
        container={scroller}
        nativeContainer={container}
      >
        {#snippet children(movePointerDown, resizePointerDown)}
          {#if bp}
            {@render renderItem({ movePointerDown, resizePointerDown, dataItem: item, item: bp, index: i })}
          {/if}
        {/snippet}
      </MoveResize>
    {/each}

    {#if extDragItem}
      <div
        class="svlt-grid-shadow shadow-active"
        style="width: {extDragItem.w * xPerPx - gapX * 2}px; height: {extDragItem.h * yPerPx - gapY * 2}px; transform: translate({extDragItem.x * xPerPx + gapX}px, {extDragItem.y * yPerPx + gapY}px);"
      ></div>
    {/if}
  {/if}
</div>

<style>
  .svlt-grid-container {
    position: relative;
    width: 100%;
  }
</style>
