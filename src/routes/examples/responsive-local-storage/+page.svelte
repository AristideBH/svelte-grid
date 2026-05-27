<script lang="ts">
  import { browser } from "$app/environment";
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const KEY = "svelte-grid-example-responsive-layout";

  const cols: ColsDefinition = [[1100, 4], [700, 1]];

  const original: GridItem[] = [
    {
      id: id(),
      4: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }),
      1: gridHelp.item({ x: 0, y: 0, w: 1, h: 2 }),
    },
    {
      id: id(),
      4: gridHelp.item({ x: 2, y: 0, w: 1, h: 2 }),
      1: gridHelp.item({ x: 0, y: 2, w: 1, h: 2 }),
    },
  ];

  function load(): GridItem[] {
    if (!browser) return original;
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : original;
  }

  let items = $state<GridItem[]>(load());
  let currentCols = $state(0);

  function save() {
    if (browser) localStorage.setItem(KEY, JSON.stringify(items));
  }

  function reset() {
    items = original.map((v, i) => ({
      ...v,
      ...(currentCols ? { [currentCols]: original[i][currentCols] } : {}),
    }));
    if (browser) localStorage.setItem(KEY, JSON.stringify(items));
  }
</script>

<svelte:head>
  <title>Example — Responsive + localStorage</title>
</svelte:head>

<div class="example-page">
  <h2>Responsive + Serialize / Restore</h2>
  <p>
    Layout per breakpoint is saved to <code>localStorage</code>. Resize the window to switch
    breakpoints, then reload to confirm restoration.
  </p>

  <div class="controls">
    <button onclick={reset}>Reset layout</button>
    <span class="cols-info">Current cols: {currentCols}</span>
  </div>

  <div class="demo-container">
    <Grid
      bind:items
      {cols}
      rowHeight={100}
      onmount={({ cols: c }) => (currentCols = c)}
      onresize={({ cols: c }) => (currentCols = c)}
      onpointerup={save}
    >
      {#snippet children({ index })}
        <div class="demo-widget">{index}</div>
      {/snippet}
    </Grid>
  </div>
</div>

<style>
  .controls {
    display: flex;
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

  button:hover {
    background: #e8e8e8;
  }

  .cols-info {
    font-size: 0.85em;
    color: #888;
  }
</style>
