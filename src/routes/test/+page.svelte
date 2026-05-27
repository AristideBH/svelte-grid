<script lang="ts">
  import Grid from "$lib/index.svelte";
  import { gridHelp } from "$lib/utils/helper.js";
  import type { ColsDefinition } from "$lib/types.js";

  interface ItemData {
    label: string;
    color: string;
  }

  const id = () => "_" + Math.random().toString(36).substring(2, 11);

  const cols: ColsDefinition = [[1200, 6], [0, 3]];

  let items = $state([
    {
      id: id(),
      data: { label: "Drag me (custom handle)", color: "#4f86c6" },
      6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, customDragger: true }),
      3: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, customDragger: true }),
    },
    {
      id: id(),
      data: { label: "Resize me", color: "#f5a623" },
      6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2, min: { w: 1, h: 1 }, max: { w: 4 } }),
      3: gridHelp.item({ x: 0, y: 2, w: 2, h: 2 }),
    },
    {
      id: id(),
      data: { label: "Fixed (cannot move)", color: "#7ed321" },
      6: gridHelp.item({ x: 4, y: 0, w: 2, h: 2, fixed: true }),
      3: gridHelp.item({ x: 0, y: 4, w: 2, h: 2, fixed: true }),
    },
    {
      id: id(),
      data: { label: "Wide item", color: "#d0021b" },
      6: gridHelp.item({ x: 0, y: 2, w: 4, h: 2 }),
      3: gridHelp.item({ x: 0, y: 6, w: 3, h: 2 }),
    },
    {
      id: id(),
      data: { label: "Tall item", color: "#9013fe" },
      6: gridHelp.item({ x: 4, y: 2, w: 2, h: 4 }),
      3: gridHelp.item({ x: 0, y: 8, w: 2, h: 3 }),
    },
  ]);

  let changeCount = $state(0);
  let lastChange = $state<{ id: string; cols: number } | null>(null);
  let mountInfo = $state<{ cols: number; xPerPx: number } | null>(null);
</script>

<svelte:head>
  <title>svelte-grid — End-to-End API Test</title>
</svelte:head>

<div class="test-page">
  <h1>Snippet API End-to-End Test</h1>

  <p>This page validates the complete Svelte 5 migration. Test checklist:</p>
  <ul>
    <li>✅ Items render with correct positions</li>
    <li>✅ Drag items — positions update in real time</li>
    <li>✅ Resize items — sizes update in real time</li>
    <li>✅ <strong>Drag me</strong> uses a custom drag handle (custom dragger)</li>
    <li>✅ <strong>Fixed</strong> item cannot be moved or resized</li>
    <li>✅ JSON dump below updates on every change (<code>onchange</code> fires)</li>
    <li>✅ <code>bind:items</code> two-way binding works (count increments on each drag/resize)</li>
  </ul>

  {#if mountInfo}
    <p class="info">Grid mounted — <code>{mountInfo.cols}</code> cols, <code>{mountInfo.xPerPx.toFixed(1)}</code>px per column</p>
  {/if}

  <div class="grid-wrap">
    <Grid
      bind:items
      {cols}
      rowHeight={90}
      gap={[8, 8]}
      onmount={(e) => (mountInfo = e)}
      onchange={(e) => { changeCount++; lastChange = { id: e.id, cols: e.cols }; }}
    >
      {#snippet children({ movePointerDown, resizePointerDown, dataItem, item, index })}
        {@const d = dataItem.data as ItemData}
        <div class="item" style="background: {d.color}; height: 100%;">
          {#if item.customDragger}
            <div class="drag-handle" onpointerdown={movePointerDown} title="Drag from here" role="button" tabindex="0">⠿</div>
          {/if}
          <div class="item-content">
            <span class="label">{d.label}</span>
            <span class="coords">{item.x},{item.y} — {item.w}×{item.h}</span>
            <span class="idx">#{index}</span>
          </div>
          {#if item.customResizer}
            <div class="resize-handle" onpointerdown={resizePointerDown} role="button" tabindex="0">↘</div>
          {/if}
        </div>
      {/snippet}
    </Grid>
  </div>

  <div class="debug">
    <h3>Live state</h3>
    <p>Change events fired: <strong>{changeCount}</strong> {#if lastChange}(last: item <code>{lastChange.id}</code> @ <code>{lastChange.cols}</code> cols){/if}</p>
    <details>
      <summary>items JSON ({items.length} items)</summary>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </details>
  </div>
</div>

<style>
  .test-page {
    padding: 20px 0;
  }

  .grid-wrap {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    margin: 20px 0;
    background: #f9f9f9;
  }

  .item {
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
  }

  .drag-handle {
    background: rgba(0, 0, 0, 0.25);
    color: white;
    padding: 4px 8px;
    cursor: grab;
    font-size: 18px;
    line-height: 1;
    text-align: center;
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 8px;
  }

  .label {
    font-weight: 600;
    color: white;
    font-size: 0.85em;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  .coords {
    font-size: 0.7em;
    color: rgba(255, 255, 255, 0.8);
    font-family: monospace;
  }

  .idx {
    font-size: 0.65em;
    color: rgba(255, 255, 255, 0.6);
  }

  .resize-handle {
    position: absolute;
    bottom: 2px;
    right: 4px;
    cursor: se-resize;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }

  .info {
    background: #e8f4fd;
    border: 1px solid #b3d9f7;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 0.9em;
    color: #1a6899;
  }

  .debug {
    margin-top: 20px;
  }

  .debug pre {
    background: #f5f5f5;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    font-size: 0.8em;
    max-height: 400px;
    overflow-y: auto;
  }

  details summary {
    cursor: pointer;
    padding: 4px 0;
    color: #555;
  }
</style>
