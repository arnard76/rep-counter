<!-- List out detials of all focusLimbs (plus delete ability) -->

<script lang="ts">
  import exercises from "$lib/exercises/store";
  import type Exercise from "$lib/exercises";
  import KeyRepArea from "$lib/key-rep-area/keyRepArea";

  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import SelectManyKeypoints from "$lib/pose-detection/SelectManyKeypoints.svelte";
  import FocusLimb from "./FocusLimb.svelte";

  export let focusLimbs: Exercise["focusLimbs"];
  export let updateFocusLimbs: (updated: Exercise["focusLimbs"]) => void;

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
    {#each Object.entries(focusLimbs) as [focusLimbName, { keyRepAreas, startKeyRepAreaIsEnd }] (focusLimbName)}
      <FocusLimb
        {focusLimbName}
        {keyRepAreas}
        updateKeyRepAreas={(updated) => {
          focusLimbs[focusLimbName].keyRepAreas = updated;
          updateFocusLimbs(focusLimbs);
        }}
        {startKeyRepAreaIsEnd}
        updateStartKeyRepAreaIsEnd={(updated) => {
          focusLimbs[focusLimbName].startKeyRepAreaIsEnd = updated;
          updateFocusLimbs(focusLimbs);
        }}
      />
    {/each}
  </div>
{/if}
