<script lang="ts">
  import { page } from "$app/stores";
</script>

<nav class="nav">
  <a href="/" class="nav-i">Home</a>
  <a href="/examples" class="nav-i" class:active={$page.url.pathname.startsWith("/examples")}>Examples</a>
  <a href="/usage" class="nav-i" class:active={$page.url.pathname === "/usage"}>Usage</a>
  <a href="/features" class="nav-i" class:active={$page.url.pathname === "/features"}>Features</a>
  <a href="/test" class="nav-i" class:active={$page.url.pathname === "/test"}>API Test</a>
  <a href="https://github.com/vaheqelyan/svelte-grid" target="_blank" rel="noreferrer" class="nav-i">GitHub</a>
</nav>

<style>
  .nav {
    width: 100%;
    display: flex;
    padding: 10px 0;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0 1.5em;
  }

  .nav-i {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    padding: 4px 0;
  }

  .nav-i:hover {
    text-decoration: underline;
  }

  .active {
    font-weight: 600;
    text-decoration: underline;
  }

  @media (max-width: 400px) {
    .nav {
      justify-content: center;
    }
  }
</style>
