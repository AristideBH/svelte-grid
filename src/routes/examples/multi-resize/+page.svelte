<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 8]];

  let items = $state<GridItem[]>([
    { id: id(), 8: gridHelp.item({ x: 1, y: 1, w: 3, h: 3 }) },
    { id: id(), 8: gridHelp.item({ x: 5, y: 0, w: 2, h: 2 }) },
  ]);

  const source = `\
<script lang="ts">
  import { Grid, gridHelp } from 'svelte-grid';

  // 8 resize handles are built-in: n, ne, e, se, s, sw, w, nw
  // Corners are 20×20px, edges are 8px thin zones
  // The SE handle keeps its classic icon for backward compat

  let items = $state([...]);
<\/script>

<Grid bind:items {cols} rowHeight={100}>
  {#snippet children({ dataItem })}
    <div class="demo-widget" style="height:100%">
      {dataItem.id}
    </div>
  {/snippet}
</Grid>

<!-- Customise corner icons via CSS -->
<style>
  :global(.svlt-grid-resizer--nw::after) {
    content: "";
    position: absolute; left: 3px; top: 3px;
    width: 5px; height: 5px;
    border-left: 2px solid rgba(0,0,0,0.4);
    border-top: 2px solid rgba(0,0,0,0.4);
  }
</style>`;
</script>

<svelte:head><title>Example — Multi-directional Resize</title></svelte:head>

<div class="example-page">
  <h2>Multi-directional resize</h2>
  <p>
    All 8 resize handles are built in by default: the 4 corners (20×20 px) and 4 edge zones (8 px).
    Hover the edges and corners to see the cursors change.
  </p>
  <p><strong>Tip:</strong> resize from the top or left edges to keep the opposite side fixed.</p>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100}>
      {#snippet children({ dataItem })}
        <div class="demo-widget">{dataItem.id.slice(1, 7)}</div>
      {/snippet}
    </Grid>
  </div>

  <details class="source">
    <summary>Source</summary>
    <pre><code>{source}</code></pre>
  </details>
</div>

<style>
  :global(.svlt-grid-resizer--nw::after) {
    content: "";
    position: absolute; left: 3px; top: 3px;
    width: 5px; height: 5px;
    border-left: 2px solid rgba(0, 0, 0, 0.4);
    border-top: 2px solid rgba(0, 0, 0, 0.4);
  }
  :global(.svlt-grid-resizer--ne::after) {
    content: "";
    position: absolute; right: 3px; top: 3px;
    width: 5px; height: 5px;
    border-right: 2px solid rgba(0, 0, 0, 0.4);
    border-top: 2px solid rgba(0, 0, 0, 0.4);
  }
  :global(.svlt-grid-resizer--sw::after) {
    content: "";
    position: absolute; left: 3px; bottom: 3px;
    width: 5px; height: 5px;
    border-left: 2px solid rgba(0, 0, 0, 0.4);
    border-bottom: 2px solid rgba(0, 0, 0, 0.4);
  }

  .source { margin-top: 20px; }
  .source summary { cursor: pointer; font-size: 0.9em; color: #666; margin-bottom: 6px; }
  .source pre {
    background: #f5f5f5; border-radius: 6px; padding: 14px;
    overflow-x: auto; font-size: 0.82em; line-height: 1.5;
    white-space: pre-wrap; margin: 0;
  }
</style>
