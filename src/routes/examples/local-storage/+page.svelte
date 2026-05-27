<script lang="ts">
  import { browser } from "$app/environment";
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const KEY = "svelte-grid-example-layout";
  const cols: ColsDefinition = [[1100, 6]];

  const original: GridItem[] = [
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ];

  function load(): GridItem[] {
    if (!browser) return original;
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : original;
  }

  let items = $state<GridItem[]>(load());

  function save() {
    if (browser) localStorage.setItem(KEY, JSON.stringify(items));
  }

  function reset() {
    items = original.map((v) => ({ ...v }));
    if (browser) localStorage.setItem(KEY, JSON.stringify(items));
  }
</script>

<svelte:head>
  <title>Example — Serialize / Restore</title>
</svelte:head>

<div class="example-page">
  <h2>Serialize / Restore</h2>
  <p>
    Layout is saved to <code>localStorage</code> on every change. Reload the page to restore it.
  </p>

  <div class="controls">
    <button onclick={reset}>Reset layout</button>
  </div>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100} onpointerup={save}>
      {#snippet children({ index })}
        <div class="demo-widget">{index}</div>
      {/snippet}
    </Grid>
  </div>
</div>

<style>
  .controls {
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
</style>
