<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { streamExercisesFromDB } from "$lib/exercises/crudDB";

  let stopReadingDatabase = () => {};
  onMount(() => (stopReadingDatabase = streamExercisesFromDB()));

  onDestroy(() => {
    stopReadingDatabase();
  });
</script>

<slot />
