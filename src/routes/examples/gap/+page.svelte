<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  const cols: ColsDefinition = [[1100, 6]];

  let gapX = $state(20);
  let gapY = $state(20);

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 0, y: 2, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 2, w: 2, h: 2 }) },
  ]);
</script>

<svelte:head>
  <title>Example — Gap</title>
</svelte:head>

<div class="example-page">
  <h2>Gap</h2>
  <p>Adjust the gap between rows and columns.</p>

  <div class="controls">
    X axis <input type="number" min={0} bind:value={gapX} />
    Y axis <input type="number" min={0} bind:value={gapY} />
  </div>

  <div class="demo-container">
    <Grid bind:items gap={[gapX, gapY]} {cols} rowHeight={100}>
      {#snippet children({ item })}
        <div class="demo-widget"></div>
      {/snippet}
    </Grid>
  </div>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    font-size: 0.9em;
  }

  input[type="number"] {
    width: 70px;
    padding: 4px 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
