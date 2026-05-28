<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";
  import DemoShell from '../DemoShell.svelte';

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 6]];

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
    { id: id(), 6: gridHelp.item({ x: 4, y: 0, w: 2, h: 2 }) },
  ]);

  let log = $state<string[]>([]);
  const push = (msg: string) => (log = [msg, ...log].slice(0, 10));

  const source = `\
<script lang="ts">
  import { Grid, gridHelp } from 'svelte-grid';

  let items = $state([...]);
  let log = $state<string[]>([]);
<\/script>

<Grid
  bind:items {cols} rowHeight={100}
  ondragstart={({ id }) => log = [\`dragstart \${id}\`, ...log]}
  onresizestart={({ id }) => log = [\`resizestart \${id}\`, ...log]}
  onchange={({ id }) => log = [\`change \${id}\`, ...log]}
  onpointerup={({ id }) => log = [\`pointerup \${id}\`, ...log]}
>
  {#snippet children({ dataItem })}
    <div class="demo-widget">{dataItem.id}</div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Drag & Resize Events" {source}>
  {#snippet description()}
    <p>
      Four event callbacks: <code>ondragstart</code>, <code>onresizestart</code>,
      <code>onchange</code> (fires during move/resize), and <code>onpointerup</code> (fires on release).
    </p>
  {/snippet}

  <Grid
    bind:items
    {cols}
    rowHeight={100}
    ondragstart={({ id }) => push(`ondragstart — ${id}`)}
    onresizestart={({ id }) => push(`onresizestart — ${id}`)}
    onchange={({ id }) => push(`onchange — ${id}`)}
    onpointerup={({ id }) => push(`onpointerup — ${id}`)}
  >
    {#snippet children({ dataItem })}
      <div class="demo-widget">{dataItem.id.slice(1, 7)}</div>
    {/snippet}
  </Grid>

  {#if log.length}
    <ul class="event-log">
      {#each log as entry, i}
        <li class:fresh={i === 0}>{entry}</li>
      {/each}
    </ul>
  {/if}
</DemoShell>

<style>
  .event-log {
    margin-top: 12px;
    padding: 10px 14px;
    background: #1e1e1e;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.82em;
    list-style: none;
    max-height: 180px;
    overflow-y: auto;
  }
  .event-log li { padding: 2px 0; color: #aaa; }
  .event-log li.fresh { color: #7efb7e; font-weight: 600; }
</style>
