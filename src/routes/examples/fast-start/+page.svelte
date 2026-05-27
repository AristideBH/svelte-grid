<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 6]];

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';

  let items = $state([...]);
<\/script>

<!--
  fastStart={true}: hides the grid until the first layout calculation
  completes on mount. Prevents a flash of items at position 0,0.
-->
<Grid bind:items cols={[[1100, 6]]} rowHeight={100} fastStart={true}>
  {#snippet children({ dataItem })}
    <div style="height:100%">{dataItem.id}</div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Fast start" {source}>
  {#snippet description()}
    <p>
      Set <code>fastStart</code> to <code>true</code> to hide the grid until the first layout
      calculation is done. This prevents the initial flash of items at position 0,0.
    </p>
  {/snippet}

  <Grid bind:items {cols} rowHeight={100} fastStart={true}>
    {#snippet children({ dataItem })}
      <div class="demo-widget">{dataItem.id}</div>
    {/snippet}
  </Grid>
</DemoShell>
