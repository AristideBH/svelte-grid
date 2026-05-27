<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

{@render children()}

<style>
  :global(.demo-container) {
    background: #eee;
    padding: 10px;
    border-radius: 6px;
    margin-top: 16px;
  }

  :global(.demo-widget) {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
    color: #333;
    overflow: hidden;
  }

  :global(.examples-nav) {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 24px;
  }

  :global(.examples-nav a) {
    font-size: 0.85em;
    padding: 4px 10px;
    border-radius: 4px;
    background: #f0f0f0;
    text-decoration: none;
    color: #333;
    border: 1px solid #ddd;
  }

  :global(.examples-nav a:hover) {
    background: #e0e0e0;
  }

  :global(.example-page) {
    padding: 20px 0;
  }

  :global(.example-page h2) {
    margin: 0 0 4px;
  }

  :global(.example-page .meta) {
    font-size: 0.82em;
    color: #888;
    margin-bottom: 12px;
  }

  :global(.example-page p) {
    color: #555;
    font-size: 0.95em;
  }

  /* ── Collapsible source block ── */
  :global(details.source) {
    margin-top: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
  }
  :global(details.source summary) {
    padding: 8px 14px;
    cursor: pointer;
    font-size: 0.85rem;
    color: #555;
    background: #fafafa;
    user-select: none;
  }
  :global(details.source summary:hover) {
    background: #f0f0f0;
  }
  :global(details.source pre) {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
    background: #1e1e1e;
    color: #d4d4d4;
    font-size: 0.8rem;
    line-height: 1.5;
  }
  :global(details.source pre code) {
    font-family: 'Cascadia Code', 'Fira Mono', monospace;
  }
</style>
