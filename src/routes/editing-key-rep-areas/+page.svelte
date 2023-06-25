<script>
  import {
    streamExercisesFromDB,
    updateExerciseOnDB,
  } from "$lib/exercises/crudDB";
  import { onDestroy, onMount } from "svelte";
  import exercises from "$lib/exercises/store";
  import { browser } from "$app/environment";

  let stopReadingDatabase = () => {};

  onMount(() => {
    if (!browser) return;
    stopReadingDatabase = streamExercisesFromDB();
  });

  onDestroy(() => {
    stopReadingDatabase();
  });

  $: exerciseName = $exercises?.exerciseName;
</script>

<button
  type="button"
  on:click={() => {
    updateExerciseOnDB("0", $exercises[exercises.getIndexOfExercise("0")]);
  }}
>
  Update database
</button>

<p>{exerciseName}</p>
{#if $exercises}
  {#each Object.entries($exercises.exerciseKeyRepAreas) as [focusLimbName, keyRepAreasForLimb] (focusLimbName)}
    <div class="KRAs-for-limb">
      <p>{focusLimbName}</p>

      {#each keyRepAreasForLimb as keyRepArea (keyRepArea)}
        <div class="key-rep-area">
          <p>{JSON.stringify(keyRepArea)}</p>

          <button
            type="button"
            on:click={() => {
              exercises.deleteKRA(focusLimbName, keyRepArea);
            }}>delete🗑️</button
          >
        </div>
      {/each}
    </div>
  {/each}
{/if}

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }

  .key-rep-area {
    display: flex;
    align-items: center;
  }

  .key-rep-area > p {
    width: 55%;
  }

  button {
    background: black;
    color: white;
    border-radius: 20px;
    padding: 5px 20px;
    cursor: pointer;
  }
</style>
