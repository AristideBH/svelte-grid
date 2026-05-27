<script lang="ts">
  // Code examples as strings to avoid false-positive module resolution in svelte-check
  const basicExample = `\
<script lang="ts">
  import Grid from 'svelte-grid';
  import { gridHelp } from 'svelte-grid/helper';
  import type { GridItem, ColsDefinition } from 'svelte-grid';

  const cols: ColsDefinition = [[1100, 12], [768, 6], [0, 3]];

  let items = $state<GridItem[]>([
    {
      id: '1',
      data: 'Widget 1',
      12: gridHelp.item({ x: 0, y: 0, w: 2, h: 2 }),
      6:  gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }),
      3:  gridHelp.item({ x: 0, y: 0, w: 3, h: 2 }),
    },
  ]);
<\/script>

<Grid bind:items {cols} rowHeight={80} onchange={({ unsafeItem }) => console.log(unsafeItem)}>
  {#snippet children({ movePointerDown, dataItem, item })}
    <div onpointerdown={movePointerDown} style="height: 100%; padding: 12px;">
      <strong>{dataItem.data}</strong>
      <small>{item.w}×{item.h}</small>
    </div>
  {/snippet}
</Grid>`;

  const controllerExample = `\
<script lang="ts">
  import Grid, { GridController } from 'svelte-grid';

  let controller = $state<GridController | undefined>(undefined);
<\/script>

<Grid bind:items {cols} {rowHeight} bind:controller>...</Grid>

<button onclick={() => controller?.addItem({ w: 2, h: 2, data: 'New' })}>Add</button>
<button onclick={() => controller?.compress()}>Compress</button>`;

  const contextExample = `\
<script>
  import { getGridContext } from 'svelte-grid';
  const grid = getGridContext(); // returns undefined outside a Grid
<\/script>

<p>Column width: {grid?.xPerPx()}px — {grid?.cols()} cols</p>
<p>Read-only: {grid?.readOnly()}</p>`;

  const cssVarsExample = `/* Override on .svlt-grid-container or any ancestor */
:global(.svlt-grid-container) {
  --svlt-handle-corner:    24px;               /* corner resize handle size */
  --svlt-handle-edge:      10px;               /* edge handle thickness */
  --svlt-shadow-bg:        rgba(99,102,241,.2);
  --svlt-shadow-radius:    6px;
  --svlt-active-opacity:   0.6;
  --svlt-cursor-grab:      grab;
  --svlt-cursor-grabbing:  grabbing;
  --svlt-focus-ring:       #4a90e2;
  --svlt-handle-color:     rgba(0,0,0,0.4);
}`;

  const tailwindExample = `<!-- 1. Strip all opinionated cosmetic defaults -->
<Grid bind:items {cols} {rowHeight} unstyled={true}>...</Grid>

/* 2. Map shadcn tokens to svelte-grid variables in globals.css */
:root {
  --svlt-shadow-bg:    hsl(var(--muted));
  --svlt-shadow-radius: var(--radius);
  --svlt-focus-ring:   hsl(var(--ring));
  --svlt-handle-color: hsl(var(--muted-foreground));
}`;

  const stylingExample = `:global(.svlt-grid-shadow)        { background: rgba(0,0,0,0.12); border-radius: 6px; }
:global(.svlt-grid-container)     { background: #f5f5f5; }
:global(.svlt-grid-resizer::after){ border-color: white !important; }
:global(.svlt-grid-active)        { opacity: 0.8; }`;
</script>

<svelte:head>
  <title>svelte-grid — Usage</title>
</svelte:head>

<div class="usage">
  <h1>Usage</h1>

  <h2>Installation</h2>
  <pre><code>npm i svelte-grid</code></pre>

  <h2>Basic Example</h2>
  <pre><code>{basicExample}</code></pre>

  <h2>Snippet Parameters</h2>
  <p>The <code>children</code> snippet receives a single object with these properties:</p>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>movePointerDown</code></td><td><code>(e: PointerEvent) =&gt; void</code></td><td>Attach to your drag handle's <code>onpointerdown</code></td></tr>
        <tr><td><code>resizePointerDown</code></td><td><code>(e: PointerEvent) =&gt; void</code></td><td>Attach to a custom resize handle when <code>customResizer: true</code></td></tr>
        <tr><td><code>dataItem</code></td><td><code>GridItem</code></td><td>Full item object (all breakpoints + your data)</td></tr>
        <tr><td><code>item</code></td><td><code>BreakpointItem</code></td><td>Item config for the active breakpoint</td></tr>
        <tr><td><code>index</code></td><td><code>number</code></td><td>Index in the items array</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Grid Props</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>items</code></td><td><code>GridItem[]</code></td><td>required</td><td>Array of grid items. Use <code>bind:items</code> for two-way binding.</td></tr>
        <tr><td><code>cols</code></td><td><code>ColsDefinition</code></td><td>required</td><td>Breakpoints: <code>[[maxWidth, cols], ...]</code></td></tr>
        <tr><td><code>rowHeight</code></td><td><code>number</code></td><td>required</td><td>Height of each row in px</td></tr>
        <tr><td><code>gap</code></td><td><code>[number, number]</code></td><td><code>[10, 10]</code></td><td><code>[gapX, gapY]</code> in px</td></tr>
        <tr><td><code>fillSpace</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Items rearrange around the active item during drag</td></tr>
        <tr><td><code>fastStart</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide grid until layout is computed on mount</td></tr>
        <tr><td><code>throttleUpdate</code></td><td><code>number</code></td><td><code>100</code></td><td>Throttle ms for container resize recalculation</td></tr>
        <tr><td><code>throttleResize</code></td><td><code>number</code></td><td><code>100</code></td><td>Throttle ms for matrix recalc during drag/resize</td></tr>
        <tr><td><code>sensor</code></td><td><code>number</code></td><td><code>20</code></td><td>Autoscroll proximity sensor in px</td></tr>
        <tr><td><code>scroller</code></td><td><code>HTMLElement</code></td><td>document root</td><td>Custom scroll container element</td></tr>
        <tr><td><code>compact</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Compact items upward after every drag/resize</td></tr>
        <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Globally disable all drag and resize interactions</td></tr>
        <tr><td><code>rows</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum visible rows (also the boundary for <code>bounds</code>)</td></tr>
        <tr><td><code>bounds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Prevent items from being moved or resized past the <code>rows</code> limit</td></tr>
        <tr><td><code>controller</code></td><td><code>GridController</code></td><td>—</td><td>Programmatic controller. Use <code>bind:controller</code> to access it.</td></tr>
        <tr><td><code>autoCompress</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Automatically compact items upward on every external <code>items</code> change</td></tr>
        <tr><td><code>collision</code></td><td><code>"push" | "none" | "compress"</code></td><td><code>"push"</code></td><td>Collision mode: push others away, allow overlap, or push + compact</td></tr>
        <tr><td><code>unstyled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Strip all cosmetic defaults (shadow, cursor, focus-ring) — ideal for Tailwind/shadcn</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Event Callbacks</h2>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Prop</th><th>Payload</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>onmount</code></td><td><code>{`{ cols, xPerPx, yPerPx }`}</code></td><td>Fired once when the grid initialises and measures its container</td></tr>
        <tr><td><code>onresize</code></td><td><code>{`{ cols, xPerPx, yPerPx, width }`}</code></td><td>Fired when the container changes width</td></tr>
        <tr><td><code>onchange</code></td><td><code>{`{ unsafeItem, id, cols }`}</code></td><td>Fired continuously while dragging or resizing</td></tr>
        <tr><td><code>onpointerup</code></td><td><code>{`{ id, cols }`}</code></td><td>Fired when a drag or resize ends</td></tr>
        <tr><td><code>ondragstart</code></td><td><code>{`{ id, cols }`}</code></td><td>Fired when a drag begins</td></tr>
        <tr><td><code>onresizestart</code></td><td><code>{`{ id, cols }`}</code></td><td>Fired when a resize begins</td></tr>
        <tr><td><code>onexternaldrop</code></td><td><code>{`{ x, y, w, h, cols, data }`}</code></td><td>Fired when an external draggable is dropped onto the grid</td></tr>
      </tbody>
    </table>
  </div>

  <h2>GridController</h2>
  <p>
    Use <code>bind:controller</code> to obtain a <code>GridController</code> instance and
    programmatically manipulate the grid without touching <code>items</code> directly.
  </p>
  <pre><code>{controllerExample}</code></pre>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Method</th><th>Returns</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>addItem(input)</code></td><td><code>void</code></td><td>Add a new item; auto-places it if <code>x</code>/<code>y</code> are omitted</td></tr>
        <tr><td><code>compress()</code></td><td><code>void</code></td><td>Compact all items upward, removing gaps</td></tr>
        <tr><td><code>getFirstAvailablePosition(w, h)</code></td><td><code>{`{x, y} | null`}</code></td><td>Find the first free grid cell that fits <code>w×h</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2>Svelte Context</h2>
  <p>
    Any component rendered inside a Grid snippet can call <code>getGridContext()</code> to access
    live grid metrics without extra prop-drilling:
  </p>
  <pre><code>{contextExample}</code></pre>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Property</th><th>Type</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>xPerPx()</code></td><td><code>number</code></td><td>Pixels per column</td></tr>
        <tr><td><code>yPerPx()</code></td><td><code>number</code></td><td>Pixels per row (rowHeight)</td></tr>
        <tr><td><code>cols()</code></td><td><code>number</code></td><td>Active column count</td></tr>
        <tr><td><code>gapX()</code> / <code>gapY()</code></td><td><code>number</code></td><td>Gap in pixels</td></tr>
        <tr><td><code>readOnly()</code></td><td><code>boolean</code></td><td>Current readOnly state</td></tr>
        <tr><td><code>collision()</code></td><td><code>string</code></td><td>Current collision mode</td></tr>
      </tbody>
    </table>
  </div>

  <h2>CSS Custom Properties</h2>
  <p>Override visual tokens on <code>.svlt-grid-container</code> or any ancestor:</p>
  <pre><code>{cssVarsExample}</code></pre>

  <h2>Tailwind / shadcn-svelte</h2>
  <p>
    Set <code>unstyled={`{true}`}</code> to remove all opinionated cosmetic defaults, then map
    shadcn tokens:
  </p>
  <pre><code>{tailwindExample}</code></pre>

  <h2>CSS Class Reference</h2>
  <pre><code>{stylingExample}</code></pre>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Class</th><th>Element</th></tr>
      </thead>
      <tbody>
        <tr><td><code>.svlt-grid-container</code></td><td>Outer container div</td></tr>
        <tr><td><code>.svlt-grid-item</code></td><td>Wrapper around each item</td></tr>
        <tr><td><code>.svlt-grid-shadow</code></td><td>Drop-target indicator during drag/resize</td></tr>
        <tr><td><code>.svlt-grid-resizer</code></td><td>Built-in resize handle (bottom-right corner)</td></tr>
        <tr><td><code>.svlt-grid-active</code></td><td>Item currently being dragged or resized</td></tr>
      </tbody>
    </table>
  </div>

  <h2>TypeScript</h2>
  <p>All types are exported from the main entry point:</p>
  <pre><code>{`import type {
  GridItem, BreakpointItem, ColsDefinition, Gap, SnippetArgs,
  ResizeDir, ExternalDropEvent, CollisionBehavior,
  GridControllerInterface, NewItemInput, PixelRect, GridRect,
} from 'svelte-grid';

import { getGridContext, type GridContext } from 'svelte-grid';`}</code></pre>
</div>

<style>
  .usage {
    padding: 20px 0;
  }

  h2 {
    margin-top: 2em;
  }

  p {
    color: #555;
    font-size: 0.95em;
    margin: 0.5em 0 1em;
  }

  pre {
    background: #1e1e1e;
    color: #d4d4d4;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    font-size: 0.82em;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }

  .table-wrap {
    overflow-x: auto;
    margin-bottom: 1em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88em;
  }

  th,
  td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid #e0e0e0;
    vertical-align: top;
  }

  th {
    background: #f9f9f9;
    font-weight: 600;
  }

  td code {
    font-size: 0.95em;
    background: #f0f0f0;
    padding: 1px 4px;
    border-radius: 3px;
  }
</style>
