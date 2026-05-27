<svelte:head>
  <title>svelte-grid — Auto Compress</title>
</svelte:head>

<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];

  let autoCompress = $state(true);

  // Items have deliberate gaps to showcase compaction
  let items = $state<GridItem[]>([
    { id: '1', data: 'A', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
    { id: '2', data: 'B', 6: gridHelp.item({ x: 2, y: 1, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 3, w: 3, h: 2 }) },
    { id: '3', data: 'C', 6: gridHelp.item({ x: 4, y: 2, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 6, w: 3, h: 2 }) },
    { id: '4', data: 'D', 6: gridHelp.item({ x: 0, y: 3, w: 3, h: 2 }), 3: gridHelp.item({ x: 0, y: 9, w: 3, h: 2 }) },
    { id: '5', data: 'E', 6: gridHelp.item({ x: 3, y: 4, w: 3, h: 2 }), 3: gridHelp.item({ x: 0, y: 12, w: 3, h: 2 }) },
  ]);

  let counter = $state(6);

  function removeItem(id: string) {
    items = items.filter((i) => i.id !== id);
  }

  function addItem() {
    const id = String(counter++);
    items = [
      ...items,
      {
        id,
        data: String.fromCharCode(64 + Number(id)),
        6: gridHelp.item({ x: 0, y: 99, w: 2, h: 2 }),
        3: gridHelp.item({ x: 0, y: 99, w: 3, h: 2 }),
      },
    ];
  }
</script>

<div class="demo-page">
  <h1>Auto Compress</h1>
  <p>
    When <code>autoCompress</code> is enabled, the grid automatically compacts all items upward
    whenever <code>items</code> changes externally (e.g. after removal or addition). Remove an item
    to see the gap close instantly.
  </p>

  <div class="controls">
    <label class="toggle">
      <input type="checkbox" bind:checked={autoCompress} />
      autoCompress = {autoCompress}
    </label>
    <button onclick={addItem}>+ Add item</button>
  </div>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={80} gap={[8, 8]} {autoCompress}>
      {#snippet children({ movePointerDown, dataItem, item })}
        <div
          class="demo-widget"
          onpointerdown={movePointerDown}
          role="button"
          tabindex="0"
          style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px; position:relative;"
        >
          <strong>{dataItem.data}</strong>
          <small>{item.w}×{item.h}</small>
          <button
            class="remove-btn"
            onclick={(e) => { e.stopPropagation(); removeItem(dataItem.id); }}
            aria-label="Remove {dataItem.data}"
          >×</button>
        </div>
      {/snippet}
    </Grid>
  </div>

  <details class="source">
    <summary>View source</summary>
    <pre><code>{`<script lang="ts">
  import Grid from 'svelte-grid';
  import type { GridItem, ColsDefinition } from 'svelte-grid';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];
  let autoCompress = $state(true);
  let items = $state<GridItem[]>([...]);

  function removeItem(id: string) {
    // When autoCompress is true, the grid compacts
    // automatically after this external mutation.
    items = items.filter((i) => i.id !== id);
  }
<\/script>

<Grid bind:items {cols} rowHeight={80} {autoCompress}>
  {#snippet children({ movePointerDown, dataItem })}
    <div onpointerdown={movePointerDown} style="height:100%">
      {dataItem.data}
      <button onclick={() => removeItem(dataItem.id)}>×</button>
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
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    user-select: none;
  }

  .controls button {
    padding: 6px 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .controls button:hover {
    background: #f0f0f0;
  }

  .remove-btn {
    position: absolute;
    top: 4px;
    right: 6px;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: rgba(0, 0, 0, 0.12);
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.85rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s;
  }

  :global(.demo-widget:hover .remove-btn) {
    opacity: 1;
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
