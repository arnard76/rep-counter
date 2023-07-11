<script lang="ts">
  import { page } from "$app/stores";
  import { createExercise } from "$legacy-pages-lib/exercises/CRUD/crudDB";
  import exercises from "$legacy-pages-lib/exercises/store";

  const defaultExerciseFormat = {
    name: "untitled",
    focusLimbs: {},
  };
</script>

{#if $exercises}
  <ul>
    {#each Object.entries($exercises) as [id, { name }] (id)}
      {@const exercisePageUrl = `${$page.url.href}/id${id.toString()}`}

      <li><a href={exercisePageUrl}>{name}</a></li>
    {/each}

    <li>
      <button on:click={() => createExercise({ ...defaultExerciseFormat })}
        >➕ new exercise</button
      >
    </li>
  </ul>
{/if}

<style>
  ul {
    list-style: none;
  }

  li {
    padding: 10px 0;
  }

  a {
    text-decoration: none;
  }
</style>
