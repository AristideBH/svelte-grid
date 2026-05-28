<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { GridController } from '$lib/GridController.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];

  let controller = $state<GridController | undefined>(undefined);
  let nextW = $state(2);
  let nextH = $state(2);
  let lastPosition = $state<{ x: number; y: number } | null>(null);

  let items = $state<GridItem[]>([
    { id: '1', data: 'Alpha', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
    { id: '2', data: 'Beta',  6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 2, w: 3, h: 2 }) },
    { id: '3', data: 'Gamma', 6: gridHelp.item({ x: 4, y: 0, w: 2, h: 3 }), 3: gridHelp.item({ x: 0, y: 4, w: 3, h: 3 }) },
  ]);

  let counter = $state(4);

  function addItem() {
    controller?.addItem({ data: `Item ${counter}`, w: nextW, h: nextH });
    counter++;
  }

  function compress() {
    controller?.compress();
  }

  function findSpace() {
    lastPosition = controller?.getFirstAvailablePosition(nextW, nextH) ?? null;
  }

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { GridController } from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';

  const cols = [[1200, 6], [0, 3]];
  let controller = $state<GridController | undefined>(undefined);
  let items = $state<GridItem[]>([...]);

  function addItem() {
    controller?.addItem({ data: 'New', w: 2, h: 2 });
  }
  function compress() {
    controller?.compress();
  }
  function findSpace() {
    const pos = controller?.getFirstAvailablePosition(2, 2);
    console.log(pos); // e.g. { x: 4, y: 0 }
  }
<\/script>

<!-- bind:controller wires up the GridController instance -->
<Grid bind:items {cols} rowHeight={80} bind:controller>
  {#snippet children({ movePointerDown, dataItem })}
    <div onpointerdown={movePointerDown} style="height:100%">
      {dataItem.data}
    </div>
  {/snippet}
</Grid>

<button onclick={addItem}>Add item</button>
<button onclick={compress}>Compress</button>`;
</script>

<DemoShell title="Grid Controller" {source}>
  {#snippet description()}
    <p>
      Use <code>bind:controller</code> to get a <code>GridController</code> instance with three
      methods: <code>addItem()</code>, <code>compress()</code>, and
      <code>getFirstAvailablePosition()</code>.
    </p>
    <div class="controls">
      <div class="size-inputs">
        <label>w: <input type="number" min="1" max="6" bind:value={nextW} /></label>
        <label>h: <input type="number" min="1" max="6" bind:value={nextH} /></label>
      </div>
      <button onclick={addItem}>+ Add item ({nextW}×{nextH})</button>
      <button onclick={compress}>⬆ Compress</button>
      <button onclick={findSpace}>🔍 Find space</button>
      {#if lastPosition}
        <span class="position-badge">→ ({lastPosition.x}, {lastPosition.y})</span>
      {/if}
    </div>
  {/snippet}

  <Grid bind:items {cols} rowHeight={80} gap={[8, 8]} bind:controller>
    {#snippet children({ movePointerDown, dataItem, item })}
      <div
        class="demo-widget"
        onpointerdown={movePointerDown}
        role="button"
        tabindex="0"
        style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;"
      >
        <strong>{dataItem.data}</strong>
        <small>{item.w}×{item.h}</small>
      </div>
    {/snippet}
  </Grid>
</DemoShell>

<style>
  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .size-inputs {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 0.9rem;
  }

  .size-inputs input {
    width: 50px;
    padding: 4px 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }

  .controls button {
    padding: 6px 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.15s;
  }

  .controls button:hover { background: #f0f0f0; }

  .position-badge {
    font-size: 0.85rem;
    color: #2563eb;
    font-family: monospace;
    background: #eff6ff;
    padding: 4px 10px;
    border-radius: 4px;
  }
</style>
