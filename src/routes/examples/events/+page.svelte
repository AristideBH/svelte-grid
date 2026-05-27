<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
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
</script>

<svelte:head>
  <title>Example — Events</title>
</svelte:head>

<div class="example-page">
  <h2>Events</h2>
  <p>
    Left box has <code>draggable: false</code>, right box has <code>resizable: false</code>.
    All four event callbacks are wired up below.
  </p>

  <div class="demo-container">
    <Grid
      bind:items
      {cols}
      rowHeight={100}
      onmount={({ cols: c }) => push(`onmount — cols: ${c}`)}
      onresize={({ cols: c, width }) => push(`onresize — cols: ${c}, width: ${Math.round(width)}`)}
      onchange={({ id: i, cols: c }) => push(`onchange — id: ${i}, cols: ${c}`)}
      onpointerup={({ id: i, cols: c }) => push(`onpointerup — id: ${i}, cols: ${c}`)}
    >
      {#snippet children({ item })}
        <div class="demo-widget">
          {item.draggable === false ? "No drag" : item.resizable === false ? "No resize" : "Box"}
        </div>
      {/snippet}
    </Grid>
  </div>

  {#if log.length}
    <ul class="event-log">
      {#each log as entry}
        <li>{entry}</li>
      {/each}
    </ul>
  {/if}
</div>

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

  .event-log li {
    padding: 2px 0;
    color: #444;
  }

  .event-log li:first-child {
    color: #1a1a1a;
    font-weight: 600;
  }
</style>
