<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 6]];

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, customDragger: true }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);
</script>

<svelte:head>
  <title>Example — Custom dragger</title>
</svelte:head>

<div class="example-page">
  <h2>Custom dragger</h2>
  <p>
    Set <code>customDragger: true</code> on an item to disable the default full-item drag target.
    Wire <code>movePointerDown</code> to your own handle element instead.
  </p>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100}>
      {#snippet children({ item, dataItem, movePointerDown })}
        <div class="demo-widget">
          {dataItem.id}
          {#if item.customDragger}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="dragger" onpointerdown={movePointerDown}>✋ Drag me</div>
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

  let items = $state([
    // customDragger: true — disables the default full-item drag target
    { id: '1', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, customDragger: true }) },
    { id: '2', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);
<\/script>

<Grid bind:items cols={[[1100, 6]]} rowHeight={100}>
  {#snippet children({ item, movePointerDown })}
    <div style="height:100%; position:relative;">
      {#if item.customDragger}
        <!-- Wire movePointerDown to your custom handle -->
        <div onpointerdown={movePointerDown} style="cursor:grab; padding:4px 8px; background:#333; color:#fff;">
          ⠿ Drag
        </div>
      {/if}
    </div>
  {/snippet}
</Grid>`}</code></pre>
  </details>
</div>

<style>
  :global(.demo-widget .dragger) {
    cursor: grab;
    user-select: none;
    color: white;
    background: #353a43;
    padding: 4px 10px;
    border-radius: 3px;
    font-size: 0.8em;
    position: absolute;
    top: 6px;
    left: 6px;
  }

  :global(.demo-widget .dragger:active) {
    cursor: grabbing;
  }
</style>
