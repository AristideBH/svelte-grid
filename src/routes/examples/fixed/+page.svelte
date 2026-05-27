<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const COLS = 10;
  const cols: ColsDefinition = [[1100, COLS]];

  let items = $state<GridItem[]>([
    { id: id(), [COLS]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 4, y: 0, w: 5, h: 2, fixed: true }) },
  ]);

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';
  import type { GridItem } from 'svelte-grid';

  const COLS = 10;
  let items = $state<GridItem[]>([
    { id: '1', [COLS]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: '2', [COLS]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
    // fixed: true — cannot be moved or resized; others push around it
    { id: '3', [COLS]: gridHelp.item({ x: 4, y: 0, w: 5, h: 2, fixed: true }) },
  ]);
<\/script>

<Grid bind:items cols={[[1100, COLS]]} rowHeight={100}>
  {#snippet children({ item })}
    <div style="height:100%; background:{item.fixed ? '#cce' : '#fff'}">
      {item.fixed ? 'Fixed' : 'Box'}
    </div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Fixed" {source}>
  {#snippet description()}
    <p>Fixed elements cannot be moved or resized. Other elements move around them.</p>
  {/snippet}

  <Grid bind:items {cols} rowHeight={100}>
    {#snippet children({ item })}
      <div class="demo-widget" style="background: {item.fixed ? '#cce' : '#fff'};">
        {item.fixed ? 'Fixed' : 'Box'}
      </div>
    {/snippet}
  </Grid>
</DemoShell>
