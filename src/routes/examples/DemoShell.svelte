<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** Page and browser-tab title (without the "svelte-grid — " prefix). */
    title: string;
    /** Source code string shown in the collapsible block. */
    source: string;
    /** Optional descriptive text / controls above the demo. */
    description?: Snippet;
    /** The demo content itself (Grid + widgets). */
    children: Snippet;
  }

  let { title, source, description, children }: Props = $props();
</script>

<svelte:head>
  <title>svelte-grid — {title}</title>
</svelte:head>

<div class="example-page">
  <h2>{title}</h2>

  {#if description}
    {@render description()}
  {/if}

  <div class="demo-container">
    {@render children()}
  </div>

  <details class="source">
    <summary>View source</summary>
    <pre><code>{source}</code></pre>
  </details>
</div>
