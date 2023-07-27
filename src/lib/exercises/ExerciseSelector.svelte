<script>
  import exercises, { selectedExerciseId } from "$lib/exercises/store";
</script>

<div style="display: flex; align-items: center; gap: 10px;">
  <p>Select an exercise to count reps</p>

  {#if $exercises}
    <select on:change={(e) => selectedExerciseId.select(e.target.value)}>
      <option value={null} />
      {#each Object.entries($exercises) as [id, { name }] (id)}
        <option value={id}>{name}</option>
      {/each}
    </select>
  {/if}
</div>
