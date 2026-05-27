<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const COLS = 6;
  const cols: ColsDefinition = [[1100, COLS]];

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  let adjustAfterRemove = $state(false);

  let items = $state<GridItem[]>([
    { id: id(), [COLS]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);

  function add() {
    const w = Math.round(randomInRange(1, 4));
    const h = Math.round(randomInRange(1, 4));
    let newItem: GridItem = { id: id(), [COLS]: gridHelp.item({ x: 0, y: 0, w, h }) };
    const pos = gridHelp.findSpace(newItem, items, COLS);
    newItem = { ...newItem, [COLS]: { ...newItem[COLS]!, ...pos } };
    items = [...items, newItem];
  }

  function addAt() {
    const w = Math.round(randomInRange(1, 4));
    const h = Math.round(randomInRange(1, 4));
    const newItem: GridItem = { id: id(), [COLS]: gridHelp.item({ x: 0, y: 0, w, h }) };
    items = gridHelp.normalize([newItem, ...items], COLS);
  }

  function remove(itemId: string) {
    items = items.filter((v) => v.id !== itemId);
    if (adjustAfterRemove) {
      items = gridHelp.adjust(items, COLS);
    }
  }
</script>

<svelte:head>
  <title>Example — Add / Remove</title>
</svelte:head>

<div class="example-page">
  <h2>Add / Remove</h2>
  <p>
    Dynamically add and remove items. Use <code>findSpace</code> to place new items without
    overlap, or <code>normalize</code> / <code>adjust</code> after removal.
  </p>

  <div class="controls">
    <button onclick={add}>Add (random size)</button>
    <button onclick={addAt}>Add at (x=0, y=0)</button>
    <label>
      <input type="checkbox" bind:checked={adjustAfterRemove} />
      Adjust after remove
    </label>
  </div>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100}>
      {#snippet children({ dataItem })}
        <div class="demo-widget">
          <button
            class="remove"
            onpointerdown={(e) => e.stopPropagation()}
            onclick={() => remove(dataItem.id)}
            aria-label="Remove"
          >✕</button>
          <p>{dataItem.id}</p>
        </div>
      {/snippet}
    </Grid>
  </div>

  <details class="source">
    <summary>View source</summary>
    <pre><code>{`<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';
  import type { GridItem } from 'svelte-grid';

  const COLS = 6;
  let items = $state<GridItem[]>([...]);

  function add() {
    const newItem: GridItem = { id: crypto.randomUUID(), [COLS]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) };
    const pos = gridHelp.findSpace(newItem, items, COLS);
    items = [...items, { ...newItem, [COLS]: { ...newItem[COLS]!, ...pos } }];
  }

  function remove(id: string) {
    items = items.filter((v) => v.id !== id);
    items = gridHelp.adjust(items, COLS); // compact after removal
  }
<\/script>

<button onclick={add}>Add</button>
<Grid bind:items cols={[[1100, COLS]]} rowHeight={100}>
  {#snippet children({ dataItem, movePointerDown })}
    <div onpointerdown={movePointerDown} style="height:100%">
      <button onpointerdown={(e) => e.stopPropagation()} onclick={() => remove(dataItem.id)}>✕</button>
    </div>
  {/snippet}
</Grid>`}</code></pre>
  </details>
</div>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  button {
    padding: 6px 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f5f5f5;
    cursor: pointer;
    font-size: 0.9em;
  }

  button:hover {
    background: #e8e8e8;
  }

  :global(.demo-widget button.remove) {
    position: absolute;
    top: 4px;
    right: 6px;
    cursor: pointer;
    font-size: 0.85em;
    color: #999;
    line-height: 1;
    border: none;
    background: none;
    padding: 0;
  }

  :global(.demo-widget button.remove:hover) {
    color: #c00;
  }

  :global(.demo-widget p) {
    margin: 0;
    font-size: 0.75em;
    color: #666;
  }
</style>
