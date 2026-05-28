<script lang="ts">
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition, CollisionBehavior } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const cols: ColsDefinition = [[1200, 6], [0, 3]];

  let collision = $state<CollisionBehavior>('push');

  function makeItems(_mode: CollisionBehavior): GridItem[] {
    return [
      { id: '1', data: 'A', 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
      { id: '2', data: 'B', 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 2, w: 3, h: 2 }) },
      { id: '3', data: 'C', 6: gridHelp.item({ x: 4, y: 0, w: 2, h: 2 }), 3: gridHelp.item({ x: 0, y: 4, w: 3, h: 2 }) },
      { id: '4', data: 'D', 6: gridHelp.item({ x: 0, y: 2, w: 3, h: 2 }), 3: gridHelp.item({ x: 0, y: 6, w: 3, h: 2 }) },
      { id: '5', data: 'E', 6: gridHelp.item({ x: 3, y: 2, w: 3, h: 2 }), 3: gridHelp.item({ x: 0, y: 8, w: 3, h: 2 }) },
    ];
  }

  let items = $state<GridItem[]>(makeItems('push'));

  // Reset layout when switching modes so the demo starts with a clean slate.
  $effect(() => {
    items = makeItems(collision);
  });

  const descriptions: Record<CollisionBehavior, string> = {
    push: 'Overlapping items are pushed to the nearest free space (default).',
    none: 'Only the dragged item moves. Others stay put and items may overlap.',
    compress: 'Items are pushed out of the way, then everything compacts upward.',
  };

  const source = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import type { GridItem, ColsDefinition, CollisionBehavior } from 'svelte-grid';

  let collision = $state<CollisionBehavior>('push');
  let items = $state<GridItem[]>([...]);
<\/script>

<!-- collision: "push" | "none" | "compress" -->
<Grid bind:items {cols} rowHeight={80} {collision}>
  {#snippet children({ movePointerDown, dataItem })}
    <div onpointerdown={movePointerDown} style="height:100%">
      {dataItem.data}
    </div>
  {/snippet}
</Grid>`;
</script>

<DemoShell title="Collision Behavior" {source}>
  {#snippet description()}
    <p>
      The <code>collision</code> prop controls what happens to other items when the dragged item
      overlaps them. Try dragging item <strong>A</strong> on top of <strong>B</strong> with each mode.
    </p>
    <div class="modes">
      {#each (['push', 'none', 'compress'] as CollisionBehavior[]) as mode}
        <button
          class="mode-btn"
          class:active={collision === mode}
          onclick={() => (collision = mode)}
        >
          <code>{mode}</code>
        </button>
      {/each}
    </div>
    <p class="mode-desc">{descriptions[collision]}</p>
  {/snippet}

  <Grid bind:items {cols} rowHeight={80} gap={[8, 8]} {collision}>
    {#snippet children({ movePointerDown, dataItem, item })}
      <div
        class="demo-widget"
        onpointerdown={movePointerDown}
        role="button"
        tabindex="0"
        style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;"
      >
        <strong>{dataItem.data}</strong>
        <small>({item.x},{item.y}) {item.w}×{item.h}</small>
      </div>
    {/snippet}
  </Grid>
</DemoShell>

<style>
  .modes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .mode-btn {
    padding: 6px 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.15s, border-color 0.15s;
  }
  .mode-btn:hover { background: #f5f5f5; }
  .mode-btn.active {
    background: #1a1a1a;
    border-color: #1a1a1a;
    color: white;
  }
  .mode-btn.active code { color: #7dd3fc; }

  .mode-desc {
    font-size: 0.85rem;
    color: #555;
    margin: 0 0 0.5rem;
    min-height: 1.4em;
  }
</style>
