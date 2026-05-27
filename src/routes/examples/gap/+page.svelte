<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 6]];

  let gapX = $state(20);
  let gapY = $state(20);

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 0, y: 2, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 2, w: 2, h: 2 }) },
  ]);

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';

  let gapX = $state(20);
  let gapY = $state(20);
  let items = $state([...]);
<\/script>

<input type="number" bind:value={gapX} />
<input type="number" bind:value={gapY} />

<!-- gap behaves like CSS gap: space between items only, zero outer padding -->
<Grid bind:items {cols} rowHeight={100} gap={[gapX, gapY]}>
  {#snippet children()}
    <div style="height:100%"></div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Gap" {source}>
  {#snippet description()}
    <p>Adjust the gap between rows and columns. Gaps act like CSS <code>gap</code> — space between items only, no outer padding.</p>
    <div class="controls">
      X axis <input type="number" min={0} bind:value={gapX} />
      Y axis <input type="number" min={0} bind:value={gapY} />
    </div>
  {/snippet}

  <Grid bind:items gap={[gapX, gapY]} {cols} rowHeight={100}>
    {#snippet children()}
      <div class="demo-widget"></div>
    {/snippet}
  </Grid>
</DemoShell>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    font-size: 0.9em;
  }

  input[type='number'] {
    width: 70px;
    padding: 4px 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
