<script>
  import { page } from "$app/stores";
  $: formattedPageName = $page.route.id.replaceAll("/", " ").trim();
</script>

<svelte:head>
  <title>{formattedPageName}</title>
</svelte:head>

{#if $page.route.id !== "/"}
  <div>
    <p><a href="/"> back 🏠 </a></p>
    <p>{formattedPageName}</p>
  </div>
{/if}

<slot />

<style>
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    background-color: lightgreen;
  }

  p {
    margin: 0;
    font-weight: 900;
    font-size: 20px;
  }
</style>
