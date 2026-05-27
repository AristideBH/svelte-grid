<script lang="ts">
  import Grid from "$lib/index.svelte";
  import { gridHelp } from "$lib/utils/helper.js";
  import type { ColsDefinition } from "$lib/types.js";

  interface CardData {
    start: string;
    end: string;
  }

  const id = () => "_" + Math.random().toString(36).substring(2, 11);
  const randomColor = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

  function generateLayout(col: number) {
    return Array.from({ length: 12 }, (_, i) => {
      const h = Math.ceil(Math.random() * 4) + 1;
      return {
        [col]: gridHelp.item({ x: (i * 2) % col, y: Math.floor(i / 6) * h, w: 2, h }),
        id: id(),
        data: { start: randomColor(), end: randomColor() } as CardData,
      };
    });
  }

  const cols: ColsDefinition = [[1287, 16]];
  let items = $state(gridHelp.adjust(generateLayout(16), 16));
</script>

<svelte:head>
  <title>svelte-grid — A draggable and resizable grid layout for Svelte 5</title>
  <meta name="description" content="A draggable and resizable grid layout with responsive breakpoints, for Svelte 5." />
</svelte:head>

<div class="welcome">
  <h1>svelte-grid</h1>
  <p>A draggable and resizable grid layout with responsive breakpoints, for Svelte 5.</p>
</div>

<Grid bind:items {cols} rowHeight={100} fillSpace={true}>
  {#snippet children({ dataItem })}
    {@const d = dataItem.data as CardData}
    <div class="card" style="background-image: linear-gradient(135deg, {d.start}, {d.end});"></div>
  {/snippet}
</Grid>

<style>
  .welcome {
    text-align: center;
    padding: 20px 0 10px;
  }

  .welcome h1 {
    margin: 0 0 8px;
  }

  .welcome p {
    color: #666;
    margin: 0;
  }

  .card {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
</style>
