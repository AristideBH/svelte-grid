<svelte:head>
  <title>svelte-grid — Features</title>
</svelte:head>

<div class="features-page">
  <h1>Features</h1>

  <section>
    <h2>Core</h2>
    <ul>
      <li><strong>Svelte 5 runes API</strong> — <code>$state</code>, <code>$derived</code>, snippets throughout; no legacy stores</li>
      <li><strong>Full TypeScript</strong> — exported types for all props, events, and helpers</li>
      <li><strong>No jQuery, no 3rd-party runtime dependencies</strong></li>
      <li><strong>Draggable widgets</strong> — pointer-based drag with autoscroll</li>
      <li><strong>Resizable widgets</strong> — multi-directional (corner + edge handles) with <code>min</code>/<code>max</code> constraints</li>
      <li><strong>Fixed / static widgets</strong> — <code>fixed: true</code> prevents all interaction; others push around them</li>
      <li><strong>Layout serializable as plain JSON</strong> — save to <code>localStorage</code> or a DB and restore on load</li>
      <li><strong>Responsive breakpoints</strong> — <code>cols</code> maps container widths to column counts</li>
      <li><strong>Configurable gap</strong> — independent X and Y gaps in pixels</li>
      <li><strong>Custom drag &amp; resize handles</strong> — <code>customDragger</code> / <code>customResizer</code> flags with snippet-level callbacks</li>
      <li><strong>Soft autoscroll during drag</strong> — configurable proximity sensor</li>
      <li><strong>Fill-space mode</strong> — items rearrange around the active item rather than being pushed linearly</li>
    </ul>
  </section>

  <section>
    <h2>New in v6</h2>
    <ul>
      <li>
        <strong>Multi-directional resize</strong> — eight resize handles (four corners + four edges),
        configurable handle sizes via CSS custom properties
      </li>
      <li>
        <strong>External drag-and-drop</strong> — drop items from outside the grid using the
        HTML Drag and Drop API; <code>onexternaldrop</code> callback with grid coordinates
      </li>
      <li>
        <strong>Compact (vertical)</strong> — <code>compact={true}</code> collapses items upward
        after every drag/resize; <code>autoCompress</code> triggers on any external change
      </li>
      <li>
        <strong>Keyboard accessibility</strong> — arrow keys move items; <kbd>Shift</kbd>+arrows resize;
        full focus management and ARIA attributes
      </li>
      <li>
        <strong>Drag &amp; Resize start events</strong> — <code>ondragstart</code> and
        <code>onresizestart</code> callbacks complement the existing <code>onpointerup</code>
      </li>
      <li>
        <strong>Read-only mode</strong> — <code>readOnly={true}</code> globally disables all
        drag and resize interactions without removing items from the DOM
      </li>
      <li>
        <strong>Rows &amp; Bounds</strong> — <code>rows</code> sets a minimum visible row count;
        <code>bounds={true}</code> prevents items from being dragged or resized past that limit
      </li>
      <li>
        <strong>GridController</strong> — programmatic API via <code>bind:controller</code>:
        <code>addItem()</code>, <code>compress()</code>, <code>getFirstAvailablePosition()</code>
      </li>
      <li>
        <strong>Collision behavior</strong> — three modes via the <code>collision</code> prop:
        <code>"push"</code> (default), <code>"none"</code> (overlap allowed), or
        <code>"compress"</code> (push + compact)
      </li>
      <li>
        <strong>CSS custom properties</strong> — all visual tokens are overridable:
        handle sizes, colors, cursors, shadow, active opacity, and focus ring
      </li>
      <li>
        <strong><code>unstyled</code> mode</strong> — strips all cosmetic defaults so you can
        theme entirely with Tailwind utilities or shadcn tokens
      </li>
      <li>
        <strong>Svelte context</strong> — <code>getGridContext()</code> gives any component
        inside a snippet access to live grid metrics (column width, row height, gaps, etc.)
        without prop-drilling
      </li>
      <li>
        <strong>Coordinate helpers</strong> — <code>gridHelp.gridToPixel()</code> and
        <code>gridHelp.pixelToGrid()</code> convert between grid units and pixel rectangles
      </li>
    </ul>
  </section>
</div>

<style>
  .features-page {
    padding: 20px 0;
  }

  section {
    margin-bottom: 2.5em;
  }

  h2 {
    margin: 0 0 0.75em;
    font-size: 1.15rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.3em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6em;
  }

  li {
    font-size: 0.92em;
    color: #444;
    padding-left: 1.4em;
    position: relative;
    line-height: 1.55;
  }

  li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #22c55e;
    font-weight: 700;
  }

  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.88em;
    background: #f0f0f0;
    padding: 1px 5px;
    border-radius: 3px;
  }

  kbd {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.82em;
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 1px 5px;
  }
</style>
