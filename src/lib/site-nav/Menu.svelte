<script>
  export let pagesAtLevel = [];

  export let topLevel = false;
</script>

<ul
  style="list-style: none; display: flex; {topLevel
    ? 'position:relative;'
    : 'position: absolute;top: 100%;'}"
>
  {#each pagesAtLevel as { name, subPages, url, active }, index (name)}
    <li on:mouseleave={() => (pagesAtLevel[index].active = false)}>
      <div class="page-link">
        <p><a href={url}>{name}</a></p>

        {#if subPages?.length}
          <div
            on:mouseenter={() => (pagesAtLevel[index].active = true)}
            class="arrow"
          >
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
    cursor: pointer;
    box-sizing: border-box;
  }

  li .page-link:hover > .arrow {
    background-color: rgba(25, 58, 87, 0.222);
  }

  li .page-link:hover {
    background-color: rgba(0, 136, 255, 0.222);
    transform: scale(1.2);
    transition: transform 0.3s 0s ease-out;
  }

  .page-link {
    display: flex;
    padding: 0 20px;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .page-link a {
    text-decoration: none;
  }
</style>
