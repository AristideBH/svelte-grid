<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const COLS = 6;
  const cols: ColsDefinition = [[1100, COLS]];
  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  let compact = $state(true);

  // Intentionally scattered layout to show the effect
  let items = $state<GridItem[]>([
    { id: id(), [COLS]: gridHelp.item({ x: 0, y: 3, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 2, y: 1, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 4, y: 0, w: 2, h: 3 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 0, y: 6, w: 3, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 3, y: 4, w: 3, h: 2 }) },
  ]);

  // Also expose gridHelp.compact() for manual use
  function compactNow() {
    items = gridHelp.compact(items, COLS);
  }

  const source = `\
<script lang="ts">
  import { Grid, gridHelp } from 'svelte-grid';

  let items = $state([...]);
<\/script>

<!-- compact={true} auto-compacts items upward after every move/resize -->
<Grid bind:items {cols} rowHeight={100} compact={true}>
  {#snippet children({ dataItem })}
    <div class="demo-widget">{dataItem.id}</div>
  {/snippet}
</Grid>

<!-- Or call gridHelp.compact() manually -->
<button onclick={() => items = gridHelp.compact(items, 6)}>
  Compact now
</button>`;
</script>

<svelte:head><title>Example — Compact (vertical)</title></svelte:head>

<div class="example-page">
  <h2>Compact (vertical)</h2>
  <p>
    With <code>compact={"{true}"}</code>, items are pushed upward to fill gaps after every
    drag/resize. You can also call <code>gridHelp.compact(items, cols)</code> manually.
  </p>
  <p>
    Toggle compact off, drag an item to create gaps, then toggle back on to see items collapse.
  </p>

  <div class="controls">
    <label>
      <input type="checkbox" bind:checked={compact} />
      compact is <strong>{compact ? "enabled" : "disabled"}</strong>
    </label>
    <button onclick={compactNow}>Compact now</button>
  </div>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100} {compact}>
      {#snippet children({ dataItem, index })}
        <div class="demo-widget">{index + 1}</div>
      {/snippet}
    </Grid>
  </div>

  <details class="source">
    <summary>Source</summary>
    <pre><code>{source}</code></pre>
  </details>
</div>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
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

  button:hover { background: #e8e8e8; }

  .source { margin-top: 20px; }
  .source summary { cursor: pointer; font-size: 0.9em; color: #666; margin-bottom: 6px; }
  .source pre {
    background: #f5f5f5; border-radius: 6px; padding: 14px;
    overflow-x: auto; font-size: 0.82em; line-height: 1.5;
    white-space: pre-wrap; margin: 0;
  }
</style>
