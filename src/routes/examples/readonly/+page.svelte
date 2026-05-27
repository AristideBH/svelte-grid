<svelte:head>
  <title>svelte-grid — Read-Only</title>
</svelte:head>

<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];

  let readOnly = $state(false);

  let items = $state<GridItem[]>([
    { id: '1', data: 'Widget A', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
    { id: '2', data: 'Widget B', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 3 }), 3: gridHelp.item({ x: 0, y: 2, w: 3, h: 3 }) },
    { id: '3', data: 'Widget C', 6: gridHelp.item({ x: 4, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 5, w: 3, h: 2 }) },
    { id: '4', data: 'Widget D', 6: gridHelp.item({ x: 0, y: 2, w: 4, h: 2 }), 3: gridHelp.item({ x: 0, y: 7, w: 3, h: 2 }) },
  ]);
</script>

<div class="demo-page">
  <h1>Read-Only</h1>
  <p>
    The <code>readOnly</code> prop globally disables all drag and resize interactions. Toggle it
    below — the grid layout is preserved, items just stop being interactive.
  </p>

  <label class="toggle">
    <input type="checkbox" bind:checked={readOnly} />
    <span>readOnly = {readOnly}</span>
  </label>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={80} gap={[8, 8]} {readOnly}>
      {#snippet children({ movePointerDown, dataItem, item })}
        <div
          class="demo-widget"
          class:locked={readOnly}
          onpointerdown={movePointerDown}
          role="button"
          tabindex="0"
          style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;"
        >
          <strong>{dataItem.data}</strong>
          <small>{item.w}×{item.h}</small>
          {#if readOnly}
            <span class="lock-icon">🔒</span>
          {/if}
        </div>
      {/snippet}
    </Grid>
  </div>

  <details class="source">
    <summary>View source</summary>
    <pre><code>{`<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';
  import type { GridItem, ColsDefinition } from 'svelte-grid';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];
  let readOnly = $state(false);

  let items = $state<GridItem[]>([
    { id: '1', data: 'Widget A', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
    { id: '2', data: 'Widget B', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 3 }), 3: gridHelp.item({ x: 0, y: 2, w: 3, h: 3 }) },
  ]);
<\/script>

<label>
  <input type="checkbox" bind:checked={readOnly} />
  readOnly = {readOnly}
</label>

<Grid bind:items {cols} rowHeight={80} {readOnly}>
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

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    user-select: none;
  }

  .lock-icon {
    font-size: 1rem;
    opacity: 0.7;
  }

  :global(.demo-widget.locked) {
    cursor: not-allowed !important;
    opacity: 0.7;
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
