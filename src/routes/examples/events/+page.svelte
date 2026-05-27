<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const COL = 6;
  const cols: ColsDefinition = [[1100, COL]];

  let log = $state<string[]>([]);

  let items = $state<GridItem[]>([
    { id: id(), [COL]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, draggable: false }) },
    { id: id(), [COL]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2, resizable: false }) },
  ]);

  function push(msg: string) {
    log = [msg, ...log].slice(0, 8);
  }

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';

  let items = $state([
    { id: '1', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2, draggable: false }) },
    { id: '2', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2, resizable: false }) },
  ]);
<\/script>

<Grid
  bind:items cols={[[1100, 6]]} rowHeight={100}
  onmount={({ cols, xPerPx, yPerPx }) => console.log('mounted', cols)}
  onresize={({ cols, xPerPx, yPerPx, width }) => console.log('resized', width)}
  onchange={({ unsafeItem, id, cols }) => console.log('changed', id)}
  onpointerup={({ id, cols }) => console.log('pointer up', id)}
  ondragstart={({ id, cols }) => console.log('drag start', id)}
  onresizestart={({ id, cols }) => console.log('resize start', id)}
>
  {#snippet children({ item })}
    <div style="height:100%">{item.draggable === false ? 'No drag' : 'Box'}</div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Events" {source}>
  {#snippet description()}
    <p>
      Left box has <code>draggable: false</code>, right box has <code>resizable: false</code>.
      All six event callbacks are wired up below.
    </p>
  {/snippet}

  <Grid
    bind:items
    {cols}
    rowHeight={100}
    onmount={({ cols: c }) => push(`onmount — cols: ${c}`)}
    onresize={({ cols: c, width }) => push(`onresize — cols: ${c}, width: ${Math.round(width)}`)}
    onchange={({ id: i, cols: c }) => push(`onchange — id: ${i}, cols: ${c}`)}
    onpointerup={({ id: i, cols: c }) => push(`onpointerup — id: ${i}, cols: ${c}`)}
    ondragstart={({ id: i }) => push(`ondragstart — id: ${i}`)}
    onresizestart={({ id: i }) => push(`onresizestart — id: ${i}`)}
  >
    {#snippet children({ item })}
      <div class="demo-widget">
        {item.draggable === false ? 'No drag' : item.resizable === false ? 'No resize' : 'Box'}
      </div>
    {/snippet}
  </Grid>

  {#if log.length}
    <ul class="event-log">
      {#each log as entry}
        <li>{entry}</li>
      {/each}
    </ul>
  {/if}
</DemoShell>

<style>
  .event-log {
    margin-top: 12px;
    padding: 10px 14px;
    background: #f5f5f5;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.82em;
    list-style: none;
  }

  .event-log li { padding: 2px 0; color: #444; }
  .event-log li:first-child { color: #1a1a1a; font-weight: 600; }
</style>
