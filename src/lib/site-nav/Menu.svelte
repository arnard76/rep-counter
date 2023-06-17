<script>
  export let pagesAtLevel = [];
</script>

<ul style="list-style: none;">
  {#each pagesAtLevel as { name, subPages, url, active }, index (name)}
    <li on:mouseleave={() => (pagesAtLevel[index].active = false)}>
      <div class="page-link">
        <p><a href={url}>{name}</a></p>

        {#if subPages?.length}
          <div on:mouseenter={() => (pagesAtLevel[index].active = true)}>
            🔽
          </div>
        {/if}
      </div>

      {#if active && subPages?.length}
        <svelte:self pagesAtLevel={subPages} />
      {/if}
    </li>
  {/each}
</ul>

<style>
  li {
    display: flex;
    flex-direction: column;
  }

  .page-link {
    display: flex;
    align-items: center;
  }
</style>
