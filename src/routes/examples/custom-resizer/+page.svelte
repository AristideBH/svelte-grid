<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 6]];

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, customResizer: true }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';

  let items = $state([
    // customResizer: true — hides the built-in resize handle
    { id: '1', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, customResizer: true }) },
    { id: '2', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);
<\/script>

<Grid bind:items cols={[[1100, 6]]} rowHeight={100}>
  {#snippet children({ item, resizePointerDown })}
    <div style="height:100%; position:relative;">
      {#if item.customResizer}
        <!-- Wire resizePointerDown to your custom resize handle -->
        <div
          onpointerdown={resizePointerDown}
          style="position:absolute; bottom:4px; right:4px; cursor:se-resize; font-size:0.75em;"
        >
          ↘ Resize
        </div>
      {/if}
    </div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Custom resizer" {source}>
  {#snippet description()}
    <p>
      Set <code>customResizer: true</code> to hide the built-in resize handle.
      Wire <code>resizePointerDown</code> to your own element.
    </p>
  {/snippet}

  <Grid bind:items {cols} rowHeight={100}>
    {#snippet children({ item, dataItem, resizePointerDown })}
      <div class="demo-widget">
        {dataItem.id}
        {#if item.customResizer}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="resizer" onpointerdown={resizePointerDown}>↘ Resize</div>
        {/if}
      </div>
    {/snippet}
  </Grid>
</DemoShell>

<style>
  :global(.demo-widget .resizer) {
    position: absolute;
    bottom: 6px;
    right: 6px;
    cursor: se-resize;
    font-size: 0.75em;
    color: #888;
    user-select: none;
  }
</style>
