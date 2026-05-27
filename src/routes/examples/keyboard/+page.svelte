<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const COLS = 6;
  const cols: ColsDefinition = [[1100, COLS]];
  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  let items = $state<GridItem[]>([
    { id: id(), [COLS]: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
    { id: id(), [COLS]: gridHelp.item({ x: 4, y: 0, w: 2, h: 2 }) },
  ]);

  const source = `\
<!-- Keyboard support is built-in for all draggable/resizable items.
     Grid items are focusable via Tab. -->

<!-- Move: Arrow keys (when item is focused) -->
<!-- Resize: Shift + Arrow keys -->
<!-- The item must be focused first (click or Tab into it) -->

<Grid bind:items {cols} rowHeight={100}>
  {#snippet children({ dataItem })}
    <!-- Make the inner content not steal focus so the grid item keeps it -->
    <div class="widget" tabindex="-1" style="height:100%">
      {dataItem.id}
    </div>
  {/snippet}
</Grid>

<style>
  /* Highlight focused items */
  :global(.svlt-grid-item:focus-visible) {
    outline: 2px solid #4a90e2;
    outline-offset: 2px;
  }
</style>`;
</script>

<svelte:head><title>Example — Keyboard accessibility</title></svelte:head>

<div class="example-page">
  <h2>Keyboard accessibility</h2>

  <div class="shortcuts">
    <div class="shortcut"><kbd>Tab</kbd> Focus next item</div>
    <div class="shortcut"><kbd>↑ ↓ ← →</kbd> Move focused item</div>
    <div class="shortcut"><kbd>Shift</kbd> + <kbd>↑ ↓ ← →</kbd> Resize focused item</div>
  </div>

  <p>Click on any card to focus it, or use <kbd>Tab</kbd> to cycle through items, then use arrow keys.</p>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={100}>
      {#snippet children({ dataItem, index })}
        <div class="demo-widget card" tabindex="-1">
          <span class="num">{index + 1}</span>
          <span class="hint">focus → arrows</span>
        </div>
      {/snippet}
    </Grid>
  </div>

  <details class="source">
    <summary>Source</summary>
    <pre><code>{source}</code></pre>
  </details>
</div>

<style>
  .shortcuts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
  }

  .shortcut {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 0.85em;
  }

  kbd {
    display: inline-block;
    background: #fff;
    border: 1px solid #bbb;
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 0.9em;
    font-family: monospace;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  :global(.demo-widget.card) {
    flex-direction: column;
    gap: 4px;
  }

  :global(.demo-widget .num) {
    font-size: 1.4em;
    font-weight: 700;
    color: #333;
  }

  :global(.demo-widget .hint) {
    font-size: 0.7em;
    color: #999;
  }

  /* Focus ring is in MoveResize CSS, but we can enhance it globally */
  :global(.svlt-grid-item:focus-visible) {
    outline: 2px solid #4a90e2 !important;
    outline-offset: 2px;
  }

  .source { margin-top: 20px; }
  .source summary { cursor: pointer; font-size: 0.9em; color: #666; margin-bottom: 6px; }
  .source pre {
    background: #f5f5f5; border-radius: 6px; padding: 14px;
    overflow-x: auto; font-size: 0.82em; line-height: 1.5;
    white-space: pre-wrap; margin: 0;
  }
</style>
