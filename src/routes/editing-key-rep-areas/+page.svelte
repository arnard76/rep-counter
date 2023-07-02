<script>
  import { updateExercise } from "$lib/exercises/CRUD/crudDB";
  import exercises, {
    selectedExercise,
    selectedExerciseId,
  } from "$lib/exercises/store";

  $: $exercises?.length && selectedExerciseId.select("0");
</script>

<button
  type="button"
  on:click={() => {
    updateExercise("0", $selectedExercise);
  }}
>
  Update database
</button>

{#if $selectedExercise}
  <p>{$selectedExercise.name}</p>
  {#each Object.entries($selectedExercise.focusLimbs) as [focusLimbName, { keyRepAreas }] (focusLimbName)}
    <div class="KRAs-for-limb">
      <p>{focusLimbName}</p>

      {#each keyRepAreas as keyRepArea (keyRepArea)}
        <div class="key-rep-area">
          <p>{JSON.stringify(keyRepArea)}</p>

          <button
            type="button"
            on:click={() => {
              exercises.deleteKRAInSelectedExercise(focusLimbName, keyRepArea);
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
