<script lang="ts">
  import { onMount } from 'svelte';
  import Grid from '$lib/index.svelte';
  import { gridHelp } from '$lib/utils/helper';
  import type { GridItem, ColsDefinition } from '$lib';
  import DemoShell from '../DemoShell.svelte';

  const id = () => '_' + Math.random().toString(36).substr(2, 9);
  const cols: ColsDefinition = [[1100, 6]];

  let useWindow = $state(false);
  let sensor = $state(20);
  let container = $state<HTMLElement | undefined>(undefined);
  let documentRoot: Element | undefined;

  const scroller = $derived(useWindow ? documentRoot : container);

  onMount(() => {
    documentRoot = document.documentElement;
  });

  let items = $state<GridItem[]>([
    { id: id(), 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 20 }) },
    { id: id(), 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2 }) },
  ]);

  const source = `\
<script lang="ts">
  import { onMount } from 'svelte';
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';

  let sensor = $state(20);           // autoscroll trigger zone in px
  let container: HTMLElement;        // custom scroll container
  let documentRoot: Element;

  onMount(() => { documentRoot = document.documentElement; });

  let items = $state([...]);
<\/script>

<div bind:this={container} style="max-height:300px; overflow-y:scroll;">
  <!--
    scroller: pass a custom scroll container, or omit for document root.
    sensor:   proximity in px from the edge that triggers autoscroll.
  -->
  <Grid bind:items cols={[[1100, 6]]} rowHeight={100} scroller={container} {sensor}>
    {#snippet children({ dataItem })}
      <div style="height:100%">{dataItem.id}</div>
    {/snippet}
  </Grid>
</div>`;
</script>

<DemoShell title="Autoscroll" {source}>
  {#snippet description()}
    <p>
      Drag a card near the edge of the scroll container to trigger autoscroll.
      Pass a <code>scroller</code> prop to use a custom container, or omit it for the document root.
    </p>
    <div class="controls">
      <label>
        <input type="checkbox" bind:checked={useWindow} />
        Use document root
      </label>
      <label>
        Sensor
        <input type="number" bind:value={sensor} min={5} max={100} style="width: 60px;" />
      </label>
    </div>
  {/snippet}

  <div class="scroll-box" class:no-clip={useWindow} bind:this={container}>
    <Grid bind:items {cols} rowHeight={100} scroller={scroller as HTMLElement | undefined} {sensor}>
      {#snippet children({ dataItem })}
        <div class="demo-widget">{dataItem.id}</div>
      {/snippet}
    </Grid>
  </div>
</DemoShell>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    margin-bottom: 10px;
    font-size: 0.9em;
  }

  .scroll-box {
    max-height: 300px;
    overflow-y: scroll;
    background: #eee;
    padding: 10px;
    border-radius: 6px;
  }

  .scroll-box.no-clip {
    max-height: none;
    overflow: visible;
  }
</style>
