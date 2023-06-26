<script lang="ts">
  import { updateExerciseOnDB } from "$lib/exercises/CRUD/crudDB";

  import type Exercise from "$lib/exercises";
  import FocusLimbsList from "./FocusLimbsList.svelte";

  export let exercise: Exercise;
</script>

<div style="width: 100%; max-height: 40vh;">
  <button
    type="button"
    on:click={() => updateExerciseOnDB(exercise.id, exercise)}
  >
    Update Database
  </button>

  <FocusLimbsList bind:focusLimbs={exercise.focusLimbs} />
</div>
