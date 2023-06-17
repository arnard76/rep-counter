<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>
    {$page.route.id.replaceAll("/", " ").trim()}
  </title>
</svelte:head>

{#if $page.route.id !== "/"}
  <p>
    <a href="/"> back 🏠 </a>
  </p>
{/if}

<p>
  {$page.route.id.replaceAll("/", " ").trim()}
</p>

<slot />

<style>
  p {
    font-weight: 900;
    font-size: 20px;
    text-transform: uppercase;
  }
</style>
