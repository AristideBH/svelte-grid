<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 5], [800, 3], [500, 1]];

  let items = $state<GridItem[]>([
    { id: id(), 5: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 1: gridHelp.item({ x: 0, y: 0, w: 1, h: 2 }) },
    { id: id(), 5: gridHelp.item({ x: 2, y: 0, w: 3, h: 2 }), 3: gridHelp.item({ x: 2, y: 0, w: 1, h: 2 }), 1: gridHelp.item({ x: 0, y: 2, w: 1, h: 2 }) },
    { id: id(), 5: gridHelp.item({ x: 0, y: 2, w: 5, h: 2 }), 3: gridHelp.item({ x: 0, y: 2, w: 3, h: 2 }), 1: gridHelp.item({ x: 0, y: 4, w: 1, h: 2 }) },
  ]);

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';
  import type { GridItem, ColsDefinition } from 'svelte-grid';

  // [maxContainerWidth, columnCount][] — sorted descending
  const cols: ColsDefinition = [[1100, 5], [800, 3], [500, 1]];

  let items = $state<GridItem[]>([
    {
      id: '1',
      5: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }),
      3: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }),
      1: gridHelp.item({ x: 0, y: 0, w: 1, h: 2 }),
    },
    // ...
  ]);
<\/script>

<Grid bind:items {cols} rowHeight={100}>
  {#snippet children({ index })}
    <div style="height:100%">{index}</div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Responsive" {source}>
  {#snippet description()}
    <p>
      Resize the window to see the grid adapt across breakpoints (5 → 3 → 1 col).
      The width in <code>cols</code> is the <em>container</em> width, not the screen width.
    </p>
  {/snippet}

  <Grid bind:items {cols} rowHeight={100}>
    {#snippet children({ index })}
      <div class="demo-widget"><h3>{index}</h3></div>
    {/snippet}
  </Grid>
</DemoShell>
