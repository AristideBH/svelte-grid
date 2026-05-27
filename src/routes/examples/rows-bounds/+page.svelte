<svelte:head>
  <title>svelte-grid — Rows &amp; Bounds</title>
</svelte:head>

<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];

  let rows = $state(5);
  let bounds = $state(true);

  let items = $state<GridItem[]>([
    { id: '1', data: 'A', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
    { id: '2', data: 'B', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 2, w: 3, h: 2 }) },
    { id: '3', data: 'C', 6: gridHelp.item({ x: 4, y: 1, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 4, w: 3, h: 2 }) },
  ]);
</script>

<div class="demo-page">
  <h1>Rows &amp; Bounds</h1>
  <p>
    <code>rows</code> sets the minimum height of the grid (in row units) — the container is always
    at least that tall. When <code>bounds</code> is also enabled, items cannot be dragged or resized
    beyond that row limit. The dashed line marks the boundary.
  </p>

  <div class="controls">
    <label>
      rows:
      <input type="range" min="2" max="10" bind:value={rows} />
      <strong>{rows}</strong>
    </label>
    <label class="toggle">
      <input type="checkbox" bind:checked={bounds} />
      bounds = {bounds}
    </label>
  </div>

  <div class="demo-container" style="position:relative">
    <Grid bind:items {cols} rowHeight={80} gap={[8, 8]} {rows} {bounds}>
      {#snippet children({ movePointerDown, dataItem, item })}
        <div
          class="demo-widget"
          onpointerdown={movePointerDown}
          role="button"
          tabindex="0"
          style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;"
        >
          <strong>{dataItem.data}</strong>
          <small>{item.w}×{item.h} @ ({item.x},{item.y})</small>
        </div>
      {/snippet}
    </Grid>
    <!-- Visual boundary indicator -->
    <div
      class="boundary-line"
      style="top: {rows * 80}px"
      title="rows boundary ({rows} rows)"
    ></div>
  </div>

  <details class="source">
    <summary>View source</summary>
    <pre><code>{`<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';
  import type { GridItem, ColsDefinition } from 'svelte-grid';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];
  let rows = $state(5);
  let bounds = $state(true);

  let items = $state<GridItem[]>([
    { id: '1', data: 'A', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
    { id: '2', data: 'B', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 2, w: 3, h: 2 }) },
  ]);
<\/script>

<!-- rows keeps the container at least N rows tall.        -->
<!-- bounds prevents items going past the rows boundary.   -->
<Grid bind:items {cols} rowHeight={80} {rows} {bounds}>
  {#snippet children({ movePointerDown, dataItem })}
    <div onpointerdown={movePointerDown} style="height:100%">
      {dataItem.data}
    </div>
  {/snippet}
</Grid>`}</code></pre>
  </details>
</div>

<style>
  .demo-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }

  .controls {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .controls label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle {
    cursor: pointer;
    user-select: none;
  }

  .boundary-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      #e53e3e 0px,
      #e53e3e 8px,
      transparent 8px,
      transparent 14px
    );
    pointer-events: none;
    z-index: 10;
    transition: top 0.2s;
  }

  .boundary-line::after {
    content: 'rows boundary';
    position: absolute;
    right: 0;
    top: 4px;
    font-size: 0.7rem;
    color: #e53e3e;
    background: white;
    padding: 0 4px;
  }

  details.source {
    margin-top: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
  }
  details.source summary {
    padding: 8px 14px;
    cursor: pointer;
    font-size: 0.85rem;
    color: #555;
    background: #fafafa;
  }
  details.source pre {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
    background: #1e1e1e;
    color: #d4d4d4;
    font-size: 0.8rem;
    line-height: 1.5;
  }
</style>
