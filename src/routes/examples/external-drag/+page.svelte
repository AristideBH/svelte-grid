<script lang="ts">
  import { Grid, gridHelp, startGridDrag } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";
  import DemoShell from '../DemoShell.svelte';

  const COLS = 8;
  const cols: ColsDefinition = [[1100, COLS]];
  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  const palette = [
    { label: "1×1", w: 1, h: 1, color: "#4a90e2" },
    { label: "2×1", w: 2, h: 1, color: "#7ed321" },
    { label: "2×2", w: 2, h: 2, color: "#e2704a" },
    { label: "3×2", w: 3, h: 2, color: "#9b59b6" },
    { label: "4×1", w: 4, h: 1, color: "#f39c12" },
  ];

  let items = $state<GridItem[]>([
    { id: id(), [COLS]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);

  interface ItemData { color: string; label: string }

  const source = `\
<script lang="ts">
  import { Grid, gridHelp, startGridDrag } from 'svelte-grid';

  let items = $state([...]);
<\/script>

<!-- External drag source -->
<div
  draggable="true"
  ondragstart={(e) => startGridDrag(e, 2, 2, { color: '#4a90e2', label: 'Widget' })}
>
  Drag me into the grid
</div>

<!-- Grid listens for drops -->
<Grid
  bind:items {cols} rowHeight={100}
  onexternaldrop={({ x, y, w, h, cols, data }) => {
    const { color, label } = data as { color: string; label: string };
    items = [...items, {
      id: crypto.randomUUID(),
      data: { color, label },
      [cols]: gridHelp.item({ x, y, w, h }),
    }];
  }}
>
  {#snippet children({ dataItem, item })}
    {@const d = dataItem.data as { color: string; label: string } | undefined}
    <div style="background: {d?.color ?? '#ccc'}; height: 100%;">
      {d?.label ?? dataItem.id}
    </div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="External drag" {source}>
  {#snippet description()}
    <p>
      Drag a widget from the palette below into the grid. Uses <code>startGridDrag()</code> to encode
      the dimensions in the drag event, and <code>onexternaldrop</code> to receive the drop.
    </p>
    <div class="palette">
      {#each palette as p}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="palette-item"
          style="background: {p.color};"
          draggable="true"
          ondragstart={(e) => startGridDrag(e, p.w, p.h, { color: p.color, label: p.label })}
        >
          {p.label}
        </div>
      {/each}
    </div>
  {/snippet}

  <Grid
    bind:items
    {cols}
    rowHeight={80}
    onexternaldrop={({ x, y, w, h, cols: c, data }) => {
      const d = data as ItemData | undefined;
      items = [
        ...items,
        {
          id: id(),
          data: d ?? { color: "#ccc", label: "Widget" },
          [c]: gridHelp.item({ x, y, w, h }),
        },
      ];
    }}
  >
    {#snippet children({ dataItem })}
      {@const d = dataItem.data as ItemData | undefined}
      <div class="demo-widget" style="background: {d?.color ?? '#fff'}; color: #fff;">
        {d?.label ?? dataItem.id.slice(1, 6)}
      </div>
    {/snippet}
  </Grid>
</DemoShell>

<style>
  .palette {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .palette-item {
    padding: 8px 16px;
    border-radius: 6px;
    color: #fff;
    font-weight: 600;
    font-size: 0.85em;
    cursor: grab;
    user-select: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .palette-item:active { cursor: grabbing; }
</style>
