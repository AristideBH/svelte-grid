<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const randomHex = () => '#' + (Math.random() * 0xffffff | 0).toString(16).padStart(6, '0');

  const COL = 16;
  const cols: ColsDefinition = [[1287, COL]];

  let fillSpace = $state(true);

  function generateLayout(): GridItem[] {
    return Array.from({ length: 20 }, (_, i) => {
      const h = Math.ceil(Math.random() * 4) + 1;
      return {
        id: id(),
        data: randomHex(),
        [COL]: gridHelp.item({ x: (i * 2) % COL, y: Math.floor(i / 6) * h, w: 2, h }),
      };
    });
  }

  let items = $state<GridItem[]>(gridHelp.adjust(generateLayout(), COL));

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';

  let fillSpace = $state(true);
  let items = $state([...20 items with random sizes...]);
<\/script>

<label>
  <input type="checkbox" bind:checked={fillSpace} />
  fillSpace
</label>

<!--
  fillSpace={true}: while dragging, each item searches for its own
  nearest free position around the active item (as opposed to pushing).
-->
<Grid bind:items cols={[[1200, 16]]} rowHeight={60} {fillSpace}>
  {#snippet children({ dataItem })}
    <div style="height:100%">{dataItem.data}</div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Fill space" {source}>
  {#snippet description()}
    <p>
      With <code>fillSpace</code> enabled, every item finds its own free position around the active
      item while dragging.
    </p>
    <label class="toggle">
      <input type="checkbox" bind:checked={fillSpace} />
      fillSpace is <strong>{fillSpace ? 'enabled' : 'disabled'}</strong>
    </label>
  {/snippet}

  <Grid bind:items {cols} rowHeight={60} {fillSpace}>
    {#snippet children({ dataItem })}
      {@const color = dataItem.data as string}
      <div class="demo-widget" style="background: {color}; color: #fff; font-size: 0.7em;">
        {color}
      </div>
    {/snippet}
  </Grid>
</DemoShell>

<style>
  .toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    font-size: 0.9em;
  }
</style>
