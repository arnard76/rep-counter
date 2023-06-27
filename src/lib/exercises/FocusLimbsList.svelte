<!-- List out detials of all focusLimbs (plus delete ability) -->

<script lang="ts">
  import exercises from "$lib/exercises/store";
  import type Exercise from "$lib/exercises";
  import KeyRepArea from "$lib/key-rep-area/keyRepArea";
  import KRAsList from "$lib/exercises/KRAsList.svelte";

  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import SelectManyKeypoints from "$lib/pose-detection/SelectManyKeypoints.svelte";

  export let focusLimbs: Exercise["focusLimbs"];

  function addKRA(focusLimbName: string) {
    exercises.addKRAToSelectedExercise(focusLimbName, new KeyRepArea());
  }

  let newFocusLimbNames: string[] | undefined;
</script>

{#if focusLimbs}
  <div>
    <SelectManyKeypoints
      bind:selectedKeypoints={newFocusLimbNames}
      {keypointNames}
    />
    <button
      on:click={() => {
        if (!newFocusLimbNames?.length) return;

        for (let newFocusLimbName of newFocusLimbNames)
          addKRA(newFocusLimbName);
      }}>add new focus limbs</button
    >
  </div>

  <div style="width:  100%;overflow-y:scroll;">
    {#each Object.entries(focusLimbs) as [focusLimbName, { keyRepAreas }] (focusLimbName)}
      <div class="KRAs-for-limb">
        <h3>{focusLimbName}</h3>

        <div>
          start & end point (key rep area) are same?
          <input
            type="checkbox"
            name=""
            id=""
            bind:checked={focusLimbs[focusLimbName].startKeyRepAreaIsEnd}
          />
        </div>

        <KRAsList bind:keyRepAreas {focusLimbName} />
        <button type="button" on:click={() => addKRA(focusLimbName)}>
          Add new KRA
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }
</style>
