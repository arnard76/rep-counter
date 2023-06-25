<script lang="ts">
  import { page } from "$app/stores";
  import exercises from "$lib/exercises/store";
</script>

{#if $exercises}
  <ul>
    {#each $exercises as exercise (exercise.id)}
      {@const { name, id } = exercise}
      <li>
        <a href={`${$page.url.href}/id${id.toString()}-${name}`}>
          <p>{name}</p>
        </a>
      </li>
    {/each}
  </ul>
{/if}
