<script lang="ts">
  import { page } from "$app/stores";
  import { createExercise } from "$lib/exercises/CRUD/crudDB";
  import exercises from "$lib/exercises/store";

  const defaultExerciseFormat = {
    name: "untitled",
    focusLimbs: {},
  };
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

    <li>
      <button on:click={() => createExercise({ ...defaultExerciseFormat })}
        >➕ new exercise</button
      >
    </li>
  </ul>
{/if}
