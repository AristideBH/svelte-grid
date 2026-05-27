<script lang="ts">
  import { Grid, gridHelp } from "$lib";
  import type { GridItem, ColsDefinition } from "$lib";

  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const randomHex = () => "#" + (Math.random() * 0xffffff | 0).toString(16).padStart(6, "0");

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
</script>

<svelte:head>
  <title>Example — Fill space</title>
</svelte:head>

<div class="example-page">
  <h2>Fill space</h2>
  <p>
    With <code>fillSpace</code> enabled, every item finds its own free position around the active
    item while dragging.
  </p>

  <label class="toggle">
    <input type="checkbox" bind:checked={fillSpace} />
    fillSpace is <strong>{fillSpace ? "enabled" : "disabled"}</strong>
  </label>

  <div class="demo-container">
    <Grid bind:items {cols} rowHeight={60} {fillSpace}>
      {#snippet children({ dataItem })}
        {@const color = dataItem.data as string}
        <div class="demo-widget" style="background: {color}; color: #fff; font-size: 0.7em;">
          {color}
        </div>
      {/snippet}
    </Grid>
  </div>
</div>

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
