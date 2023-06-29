<script lang="ts">
  import { page } from "$app/stores";
  import exercises from "$lib/exercises/store";
</script>

{#if $exercises}
  <ul>
    {#each Object.entries($exercises) as [id, exercise] (id)}
      {@const { name } = exercise}
      <li>
        <a href={`${$page.url.href}/id${id.toString()}-${name}`}>
          <p>{name}</p>
        </a>
      </li>
    {/each}
  </ul>
{/if}
