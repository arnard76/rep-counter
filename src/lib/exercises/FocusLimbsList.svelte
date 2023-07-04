<!-- List out detials of all focusLimbs (plus delete ability) -->

<script lang="ts">
  import type Exercise from "$lib/exercises";
  import KeyRepArea from "$lib/key-rep-area/keyRepArea";

  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import SelectManyKeypoints from "$lib/pose-detection/SelectManyKeypoints.svelte";
  import FocusLimb from "./FocusLimb.svelte";

  export let focusLimbs: Exercise["focusLimbs"];
  export let updateFocusLimbs: (updated: Exercise["focusLimbs"]) => void;

  function addKRA(focusLimbName: string) {
    if (!Object.keys(focusLimbs).includes(focusLimbName)) {
      focusLimbs[focusLimbName] = { keyRepAreas: [] };
    }

    focusLimbs[focusLimbName].keyRepAreas.push(new KeyRepArea());
    updateFocusLimbs(focusLimbs);
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
          if (!updated.length) {
            delete focusLimbs[focusLimbName];
          } else {
            focusLimbs[focusLimbName].keyRepAreas = updated;
          }
          updateFocusLimbs(focusLimbs);
        }}
        {startKeyRepAreaIsEnd}
        updateStartKeyRepAreaIsEnd={(updated) => {
          if (updated === undefined) {
            delete focusLimbs[focusLimbName].startKeyRepAreaIsEnd;
          } else {
            focusLimbs[focusLimbName].startKeyRepAreaIsEnd = updated;
          }
          updateFocusLimbs(focusLimbs);
        }}
      />
    {/each}
  </div>
{/if}
