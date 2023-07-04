<script lang="ts">
  import { updateExercise as updateExerciseOnDb } from "$lib/exercises/CRUD/crudDB";

  import type Exercise from "$lib/exercises";
  import FocusLimbsList from "./FocusLimbsList.svelte";

  export let exercise: Exercise;
  export let exerciseId: string;
  export let updateExercise: (updatedExercise: Exercise) => void;
</script>

<div>
  <FocusLimbsList
    focusLimbs={exercise.focusLimbs}
    updateFocusLimbs={(updated) =>
      updateExercise({ ...exercise, focusLimbs: updated })}
  />

  <button on:click={() => updateExerciseOnDb(exerciseId, exercise)}>
    Update Database
  </button>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  button {
    margin-top: 15px;
  }
</style>
