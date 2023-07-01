<script lang="ts">
  import { updateExercise } from "$lib/exercises/CRUD/crudDB";

  import type Exercise from "$lib/exercises";
  import FocusLimbsList from "./FocusLimbsList.svelte";

  export let exercise: Exercise;
</script>

<div
  style="width: 100%; height: 100%; display:flex; flex-direction:column; align-items:flex-start;"
>
  <button type="button" on:click={() => updateExercise(exercise)}>
    Update Database
  </button>

  <FocusLimbsList bind:focusLimbs={exercise.focusLimbs} />
</div>
