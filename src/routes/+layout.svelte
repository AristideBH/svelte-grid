<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./components/Nav.svelte";
  import Ribbon from "./components/Ribbon.svelte";
  import Footer from "./components/Footer.svelte";

  let { children }: { children: Snippet } = $props();
</script>

<Ribbon />
<Nav />

<div class="content">
  <div class="container">
    {@render children()}
  </div>
</div>

<Footer />

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, sans-serif;
    overflow-y: scroll;
  }

  /* :global(.svlt-grid-resizer::after) {
    border-color: white !important;
  } */

  :global(.svlt-grid-shadow) {
    border-radius: 6px;
  }

  :global(.svlt-grid-item) {
    border-radius: 6px;
  }

  .content {
    flex: 1;
    display: flex; 
    flex-direction: column;
    height: 100%;
    padding: 0 10px;
  }

  .container {
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
  }
</style>
