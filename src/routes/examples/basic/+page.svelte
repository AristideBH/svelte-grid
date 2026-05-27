<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  const cols: ColsDefinition = [[1100, 6]];

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);
</script>

<svelte:head>
  <title>Example — Basic</title>
</svelte:head>

<div class="example-page">
  <h2>Basic</h2>
  <p>Drag some boxes around, resize them. This is a basic, non-responsive layout.</p>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100}>
      {#snippet children({ dataItem, item })}
        <div class="demo-widget">{dataItem.id}</div>
      {/snippet}
    </Grid>
  </div>
</div>
