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
      <small>{item.w}x{item.h}</small>
    </div>
  {/snippet}
</Grid>`;

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
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>movePointerDown</code></td><td><code>(e: PointerEvent) =&gt; void</code></td><td>Attach to your drag handle element's <code>onpointerdown</code></td></tr>
        <tr><td><code>resizePointerDown</code></td><td><code>(e: PointerEvent) =&gt; void</code></td><td>Attach to a custom resize handle when <code>customResizer: true</code></td></tr>
        <tr><td><code>dataItem</code></td><td><code>GridItem</code></td><td>Full item object (all breakpoints + your data)</td></tr>
        <tr><td><code>item</code></td><td><code>BreakpointItem</code></td><td>Item for the active breakpoint column count</td></tr>
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
        <tr><td><code>items</code></td><td><code>GridItem[]</code></td><td>required</td><td>Use <code>bind:items</code> for two-way binding</td></tr>
        <tr><td><code>cols</code></td><td><code>ColsDefinition</code></td><td>required</td><td>Breakpoints: <code>[[maxWidth, cols], ...]</code></td></tr>
        <tr><td><code>rowHeight</code></td><td><code>number</code></td><td>required</td><td>Height of each row in px</td></tr>
        <tr><td><code>gap</code></td><td><code>[number, number]</code></td><td><code>[10, 10]</code></td><td><code>[gapX, gapY]</code> in px</td></tr>
        <tr><td><code>fillSpace</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Items rearrange around the active item</td></tr>
        <tr><td><code>fastStart</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide grid until layout is computed</td></tr>
        <tr><td><code>throttleUpdate</code></td><td><code>number</code></td><td><code>100</code></td><td>Throttle ms for container resize recalc</td></tr>
        <tr><td><code>throttleResize</code></td><td><code>number</code></td><td><code>100</code></td><td>Throttle ms for matrix recalc during drag/resize</td></tr>
        <tr><td><code>sensor</code></td><td><code>number</code></td><td><code>20</code></td><td>Autoscroll proximity sensor in px</td></tr>
        <tr><td><code>scroller</code></td><td><code>HTMLElement</code></td><td>document root</td><td>Custom scroll container</td></tr>
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
        <tr><td><code>onmount</code></td><td><code>{`{ cols, xPerPx, yPerPx }`}</code></td><td>Fired once on grid initialise</td></tr>
        <tr><td><code>onresize</code></td><td><code>{`{ cols, xPerPx, yPerPx, width }`}</code></td><td>Fired on container width change</td></tr>
        <tr><td><code>onchange</code></td><td><code>{`{ unsafeItem, id, cols }`}</code></td><td>Fired while dragging or resizing</td></tr>
        <tr><td><code>onpointerup</code></td><td><code>{`{ id, cols }`}</code></td><td>Fired when drag or resize ends</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Styling</h2>
  <pre><code>{stylingExample}</code></pre>

  <p>CSS class reference:</p>
  <ul>
    <li><code>.svlt-grid-container</code> — outer container div</li>
    <li><code>.svlt-grid-item</code> — wrapper around each item</li>
    <li><code>.svlt-grid-shadow</code> — drop target indicator during drag/resize</li>
    <li><code>.svlt-grid-resizer</code> — built-in resize handle</li>
    <li><code>.svlt-grid-active</code> — item being dragged or resized</li>
  </ul>
</div>

<style>
  .usage {
    padding: 20px 0;
  }

  h2 {
    margin-top: 2em;
  }

  pre {
    background: #f5f5f5;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    font-size: 0.85em;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9em;
  }

  th,
  td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background: #f9f9f9;
    font-weight: 600;
  }
</style>
