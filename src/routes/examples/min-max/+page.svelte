<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const COL = 10;
  const cols: ColsDefinition = [[1100, COL]];

  let items = $state<GridItem[]>([
    {
      id: id(),
      [COL]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, max: { w: 2, h: 2 } }),
    },
    {
      id: id(),
      [COL]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2, max: { w: 4, h: 5 } }),
    },
  ]);
</script>

<svelte:head>
  <title>Example — Min / Max</title>
</svelte:head>

<div class="example-page">
  <h2>Min / Max size</h2>
  <p>Control how much users can resize an item with <code>min</code> and <code>max</code> constraints.</p>
  <p>Left box: max 2×2. Right box: max 4×5.</p>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100}>
      {#snippet children({ item, index })}
        <div class="demo-widget">
          {index + 1} — max: {item.max?.w}×{item.max?.h}
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

  const COL = 10;
  let items = $state<GridItem[]>([
    {
      id: '1',
      [COL]: gridHelp.item({
        x: 0, y: 0, w: 2, h: 2,
        min: { w: 1, h: 1 },  // minimum size
        max: { w: 2, h: 2 },  // maximum size
      }),
    },
  ]);
<\/script>

<Grid bind:items cols={[[1100, COL]]} rowHeight={100}>
  {#snippet children({ item })}
    <div style="height:100%">max: {item.max?.w}×{item.max?.h}</div>
  {/snippet}
</Grid>`}</code></pre>
  </details>
</div>
