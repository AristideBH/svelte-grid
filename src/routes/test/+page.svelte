<svelte:head>
  <title>svelte-grid — API Test</title>
</svelte:head>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Pane as PaneType } from 'tweakpane';
  import Grid from '$lib/index.svelte';
  import { GridController } from '$lib/GridController.svelte';
  import { getGridContext } from '$lib/context';
  import { gridHelp } from '$lib/utils/helper';
  import type { ColsDefinition, CollisionBehavior, BreakpointItem } from '$lib';

  // ─── Grid options (all driven by Tweakpane) ─────────────────────────────────
  let opts = $state({
    rowHeight:       90,
    gapX:             8,
    gapY:             8,
    sensor:          20,
    throttleUpdate: 100,
    throttleResize: 100,
    fillSpace:    false,
    compact:      false,
    autoCompress: false,
    collision:   'push' as CollisionBehavior,
    readOnly:     false,
    rows:             0,
    bounds:       false,
    fastStart:    false,
    unstyled:     false,
  });

  const cols: ColsDefinition = [[1200, 6], [0, 3]];
  let controller = $state<GridController | undefined>(undefined);

  let items = $state([
    { id: '1', data: { label: 'Alpha',   color: '#4f86c6' }, 6: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }),                        3: gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }) },
    { id: '2', data: { label: 'Beta',    color: '#f5a623' }, 6: gridHelp.item({ x: 2, y: 0, w: 2, h: 2, customDragger: true }),    3: gridHelp.item({ x: 0, y: 2, w: 3, h: 2, customDragger: true }) },
    { id: '3', data: { label: 'Gamma',   color: '#7ed321' }, 6: gridHelp.item({ x: 4, y: 0, w: 2, h: 2, fixed: true }),            3: gridHelp.item({ x: 0, y: 4, w: 3, h: 2, fixed: true }) },
    { id: '4', data: { label: 'Delta',   color: '#d0021b' }, 6: gridHelp.item({ x: 0, y: 2, w: 3, h: 3 }),                        3: gridHelp.item({ x: 0, y: 6, w: 3, h: 3 }) },
    { id: '5', data: { label: 'Epsilon', color: '#9013fe' }, 6: gridHelp.item({ x: 3, y: 2, w: 3, h: 2 }),                        3: gridHelp.item({ x: 0, y: 9, w: 3, h: 2 }) },
  ]);

  // ─── Event log ───────────────────────────────────────────────────────────────
  let eventLog = $state<string[]>([]);
  function log(msg: string) {
    eventLog = [`${new Date().toLocaleTimeString()} — ${msg}`, ...eventLog].slice(0, 30);
  }
  let changeCount = $state(0);

  // ─── Tweakpane ───────────────────────────────────────────────────────────────
  let paneEl: HTMLDivElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pane: any; // typed loosely; full types via PaneType below for IDE hints

  onMount(async () => {
    const { Pane } = await import('tweakpane');
    // Cast so we get proper IDE completion while avoiding the strict-null
    // narrowing issue with the generic container methods in v4.
    pane = new Pane({ container: paneEl, title: 'Grid options' }) as unknown as PaneType;

    const layout = pane.addFolder({ title: 'Layout', expanded: true });
    layout.addBinding(opts, 'rowHeight',      { min: 40,  max: 200, step: 5,  label: 'rowHeight' });
    layout.addBinding(opts, 'gapX',           { min: 0,   max: 40,  step: 1,  label: 'gap X' });
    layout.addBinding(opts, 'gapY',           { min: 0,   max: 40,  step: 1,  label: 'gap Y' });
    layout.addBinding(opts, 'rows',           { min: 0,   max: 20,  step: 1,  label: 'rows (min)' });

    const behaviour = pane.addFolder({ title: 'Behaviour', expanded: true });
    behaviour.addBinding(opts, 'collision', {
      label: 'collision',
      options: { push: 'push', none: 'none', compress: 'compress' },
    });
    behaviour.addBinding(opts, 'fillSpace',    { label: 'fillSpace' });
    behaviour.addBinding(opts, 'compact',      { label: 'compact' });
    behaviour.addBinding(opts, 'autoCompress', { label: 'autoCompress' });
    behaviour.addBinding(opts, 'bounds',       { label: 'bounds' });

    const access = pane.addFolder({ title: 'Access', expanded: false });
    access.addBinding(opts, 'readOnly', { label: 'readOnly' });
    access.addBinding(opts, 'unstyled', { label: 'unstyled' });

    const perf = pane.addFolder({ title: 'Performance', expanded: false });
    perf.addBinding(opts, 'throttleUpdate', { min: 0, max: 500, step: 10, label: 'throttleUpdate ms' });
    perf.addBinding(opts, 'throttleResize', { min: 0, max: 500, step: 10, label: 'throttleResize ms' });
    perf.addBinding(opts, 'sensor',         { min: 0, max: 100, step: 1,  label: 'sensor px' });
    perf.addBinding(opts, 'fastStart',      { label: 'fastStart' });

    const ctrl = pane.addFolder({ title: 'Controller', expanded: false });
    ctrl.addButton({ title: '+ addItem (2×2)' }).on('click', () => {
      controller?.addItem({ w: 2, h: 2, data: { label: `Item ${items.length + 1}`, color: randomColor() } });
      log('controller.addItem()');
    });
    ctrl.addButton({ title: '⬆ compress()' }).on('click', () => {
      controller?.compress();
      log('controller.compress()');
    });
    ctrl.addButton({ title: '🔍 findSpace(2,2)' }).on('click', () => {
      const pos = controller?.getFirstAvailablePosition(2, 2);
      log(`getFirstAvailablePosition(2,2) → ${JSON.stringify(pos)}`);
    });
    ctrl.addButton({ title: '↺ Reset layout' }).on('click', () => {
      items = items.map((item, i) => ({
        ...item,
        6: { ...(item[6] ?? {}), x: (i % 3) * 2, y: Math.floor(i / 3) * 2 },
        3: { ...(item[3] ?? {}), x: 0, y: i * 2 },
      }));
      log('layout reset');
    });
  });

  onDestroy(() => pane?.dispose());

  function randomColor() {
    return `hsl(${Math.round(Math.random() * 360)}, 60%, 55%)`;
  }
</script>

<!-- ── Widget snippet (uses getGridContext to demonstrate context API) ── -->
{#snippet widget(args: {
  movePointerDown: (e: PointerEvent) => void;
  resizePointerDown: (e: PointerEvent) => void;
  data: { label: string; color: string };
  item: BreakpointItem;
  index: number;
  id: string;
  onremove: (id: string) => void;
})}
  {@const ctx = getGridContext()}
  <div
    class="w-card"
    style="background:{args.data.color}; height:100%;"
    onpointerdown={!args.item.customDragger ? args.movePointerDown : undefined}
    role="button"
    tabindex="0"
  >
    {#if args.item.customDragger}
      <div class="w-drag-handle" onpointerdown={args.movePointerDown} role="button" tabindex="-1">⠿</div>
    {/if}
    <div class="w-body">
      <span class="w-label">{args.data.label}</span>
      {#if args.item.fixed}<span class="w-badge">fixed</span>{/if}
      <span class="w-meta">{args.item.x},{args.item.y} — {args.item.w}×{args.item.h}</span>
      {#if ctx}
        <span class="w-meta">{ctx.cols()} cols · {ctx.xPerPx().toFixed(0)}px/col</span>
      {/if}
    </div>
    {#if !args.item.fixed}
      <button
        class="w-remove"
        onclick={(e) => { e.stopPropagation(); args.onremove(args.id); }}
        aria-label="Remove {args.data.label}"
      >×</button>
    {/if}
  </div>
{/snippet}

<div class="test-layout">
  <!-- ── Tweakpane sidebar ── -->
  <aside class="sidebar">
    <div bind:this={paneEl}></div>
  </aside>

  <!-- ── Main content ── -->
  <main class="content">
    <h1>API Test <span class="subtitle">— live Tweakpane controls</span></h1>

    <div class="grid-wrap" class:unstyled-wrap={opts.unstyled}>
      <Grid
        bind:items
        bind:controller
        {cols}
        rowHeight={opts.rowHeight}
        gap={[opts.gapX, opts.gapY]}
        fillSpace={opts.fillSpace}
        compact={opts.compact}
        autoCompress={opts.autoCompress}
        collision={opts.collision}
        readOnly={opts.readOnly}
        rows={opts.rows}
        bounds={opts.bounds}
        fastStart={opts.fastStart}
        unstyled={opts.unstyled}
        sensor={opts.sensor}
        throttleUpdate={opts.throttleUpdate}
        throttleResize={opts.throttleResize}
        onmount={(e) => log(`onmount — ${e.cols} cols, ${e.xPerPx.toFixed(1)}px/col`)}
        onchange={(e) => { changeCount++; log(`onchange — item ${e.id}`); }}
        onpointerup={(e) => log(`onpointerup — item ${e.id}`)}
        ondragstart={(e) => log(`ondragstart — item ${e.id}`)}
        onresizestart={(e) => log(`onresizestart — item ${e.id}`)}
      >
        {#snippet children({ movePointerDown, resizePointerDown, dataItem, item, index })}
          {@render widget({
            movePointerDown,
            resizePointerDown,
            data: dataItem.data as { label: string; color: string },
            item,
            index,
            id: dataItem.id,
            onremove: (id) => { items = items.filter((i) => i.id !== id); log(`removed ${id}`); },
          })}
        {/snippet}
      </Grid>
    </div>

    <!-- ── Event log ── -->
    <section class="debug">
      <h3>Event log <small>({changeCount} changes)</small></h3>
      <div class="log">
        {#each eventLog as entry}
          <div class="log-entry">{entry}</div>
        {:else}
          <div class="log-empty">No events yet — interact with the grid.</div>
        {/each}
      </div>
    </section>

    <!-- ── Live JSON ── -->
    <section class="debug">
      <details>
        <summary>items JSON ({items.length} items)</summary>
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </details>
    </section>
  </main>
</div>

<style>
  .test-layout {
    display: flex;
    align-items: flex-start;
    min-height: 100vh;
  }

  .sidebar {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    max-height: 100vh;
    overflow-y: auto;
    padding: 10px 6px;
    background: #fafafa;
    border-right: 1px solid #e5e5e5;
  }

  /* Make Tweakpane fill the sidebar width */
  .sidebar :global(.tp-dfwv) {
    width: 100% !important;
  }

  .content {
    flex: 1;
    min-width: 0;
    padding: 16px 20px;
  }

  h1 { margin: 0 0 12px; font-size: 1.3rem; }
  .subtitle { font-size: 0.75em; color: #888; font-weight: 400; }

  .grid-wrap {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 16px;
    background: #f9f9f9;
    min-height: 100px;
  }
  .unstyled-wrap { background: white; border-color: #999; }

  /* ── Widget ── */
  .w-card {
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
    position: relative;
  }
  .w-drag-handle {
    background: rgba(0,0,0,0.25);
    color: white;
    padding: 3px 8px;
    cursor: grab;
    font-size: 15px;
    text-align: center;
    flex-shrink: 0;
  }
  .w-drag-handle:active { cursor: grabbing; }
  .w-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 6px;
    text-align: center;
  }
  .w-label  { font-weight: 700; color: white; font-size: 0.85em; text-shadow: 0 1px 2px rgba(0,0,0,0.4); }
  .w-badge  { font-size: 0.65em; background: rgba(0,0,0,0.25); color: white; padding: 1px 5px; border-radius: 3px; }
  .w-meta   { font-size: 0.65em; color: rgba(255,255,255,0.75); font-family: monospace; }
  .w-remove {
    position: absolute;
    top: 4px; right: 4px;
    width: 18px; height: 18px;
    padding: 0;
    border: none;
    background: rgba(0,0,0,0.25);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .w-card:hover .w-remove { opacity: 1; }

  /* ── Debug ── */
  .debug { margin-top: 10px; }
  .debug h3 { margin: 0 0 5px; font-size: 0.95rem; }
  .debug small { color: #888; font-weight: 400; }
  .log {
    background: #1e1e1e;
    color: #d4d4d4;
    border-radius: 6px;
    padding: 8px 12px;
    font-family: monospace;
    font-size: 0.72rem;
    line-height: 1.6;
    max-height: 160px;
    overflow-y: auto;
  }
  .log-entry { border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1px 0; }
  .log-empty { color: #666; font-style: italic; }
  .debug pre {
    background: #f5f5f5;
    border-radius: 6px;
    padding: 14px;
    overflow-x: auto;
    font-size: 0.72em;
    max-height: 320px;
    overflow-y: auto;
  }
  details summary {
    cursor: pointer;
    padding: 4px 0;
    color: #555;
    font-size: 0.9rem;
  }
</style>
