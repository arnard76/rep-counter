<script>
  import exercises, { selectedExerciseId } from "$lib/exercises/store";
</script>

{#if $exercises}
  <select on:change={(e) => selectedExerciseId.select(e.target.value)}>
    <option value={null} />
    {#each Object.entries($exercises) as [id, { name }] (id)}
      <option value={id}>{name}</option>
    {/each}
  </select>
{/if}
