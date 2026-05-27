<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

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
  ondragstart={({ id, cols }) => log = [\`dragstart \${id}\`, ...log]}
  onresizestart={({ id, cols }) => log = [\`resizestart \${id}\`, ...log]}
  onchange={({ id }) => log = [\`change \${id}\`, ...log]}
  onpointerup={({ id }) => log = [\`pointerup \${id}\`, ...log]}
>
  {#snippet children({ dataItem })}
    <div class="demo-widget">{dataItem.id}</div>
  {/snippet}
</Grid>`;
</script>

<svelte:head><title>Example — Drag & Resize Events</title></svelte:head>

<div class="example-page">
  <h2>Drag & Resize Events</h2>
  <p>
    Four event callbacks: <code>ondragstart</code>, <code>onresizestart</code>,
    <code>onchange</code> (fires during move/resize), and <code>onpointerup</code> (fires on release).
  </p>

  <div class="demo-container">
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
  </div>

  {#if log.length}
    <ul class="event-log">
      {#each log as entry, i}
        <li class:fresh={i === 0}>{entry}</li>
      {/each}
    </ul>
  {/if}

  <details class="source">
    <summary>Source</summary>
    <pre><code>{source}</code></pre>
  </details>
</div>

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

  .source { margin-top: 20px; }
  .source summary { cursor: pointer; font-size: 0.9em; color: #666; margin-bottom: 6px; }
  .source pre {
    background: #f5f5f5; border-radius: 6px; padding: 14px;
    overflow-x: auto; font-size: 0.82em; line-height: 1.5;
    white-space: pre-wrap; margin: 0;
  }
</style>
