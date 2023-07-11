<script>
  import { updateExercise } from "$legacy-pages-lib/exercises/CRUD/crudDB";
  import exercises, {
    selectedExercise,
    selectedExerciseId,
  } from "$legacy-pages-lib/exercises/store";

  selectedExerciseId.select("0");
</script>

<button type="button" on:click={() => updateExercise("0", $selectedExercise)}>
  Update database
</button>

{#if $selectedExercise}
  <p>{$selectedExercise.name}</p>
  {#each Object.entries($selectedExercise.focusLimbs) as [focusLimbName, { keyRepAreas }] (focusLimbName)}
    <div class="KRAs-for-limb">
      <p>{focusLimbName}</p>

      {#each keyRepAreas as keyRepArea, index (keyRepArea)}
        <div class="key-rep-area">
          <p>{JSON.stringify(keyRepArea)}</p>

          <button
            type="button"
            on:click={() => {
              $exercises[$selectedExerciseId].focusLimbs[
                focusLimbName
              ].keyRepAreas.splice(index, 1);

              if (
                !$exercises[$selectedExerciseId].focusLimbs[focusLimbName]
                  .keyRepAreas.length
              ) {
                delete $exercises[$selectedExerciseId].focusLimbs[
                  focusLimbName
                ];
              }
              $exercises = $exercises;
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
