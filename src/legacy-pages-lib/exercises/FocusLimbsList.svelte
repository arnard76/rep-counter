<!-- List out detials of all focusLimbs (plus delete ability) -->

<script lang="ts">
  import type Exercise from "$legacy-pages-lib/exercises";
  import KeyRepArea from "$legacy-pages-lib/key-rep-area/keyRepArea";

  import keypointNames from "$legacy-pages-lib/pose-detection/keypointNames.json";
  import SelectManyKeypoints from "$legacy-pages-lib/pose-detection/SelectManyKeypoints.svelte";
  import FocusLimb from "./FocusLimb.svelte";

  export let focusLimbs: Exercise["focusLimbs"];
  export let updateFocusLimbs: (updated: Exercise["focusLimbs"]) => void;

  function addKRA(focusLimbName: string) {
    if (!Object.keys(focusLimbs).includes(focusLimbName)) {
      focusLimbs[focusLimbName] = { keyRepAreas: [] };
    }

    const defaultKRA = new KeyRepArea();
    focusLimbs[focusLimbName].keyRepAreas.push(defaultKRA);
    const length = focusLimbs[focusLimbName].keyRepAreas.length;

    if (length >= 2 && focusLimbs[focusLimbName].startKeyRepAreaIsEnd) {
      focusLimbs[focusLimbName].keyRepAreas[length - 1] =
        focusLimbs[focusLimbName].keyRepAreas[length - 2];
      focusLimbs[focusLimbName].keyRepAreas[length - 2] = defaultKRA;
    }
    updateFocusLimbs(focusLimbs);
  }

  let newFocusLimbNames: string[] | undefined;
</script>

{#if focusLimbs}
  <div style="display: flex;">
    <SelectManyKeypoints
      bind:selectedKeypoints={newFocusLimbNames}
      {keypointNames}
    />
    <button
      on:click={() => {
        if (!newFocusLimbNames?.length) return;

        for (let newFocusLimbName of newFocusLimbNames)
          addKRA(newFocusLimbName);
      }}>add</button
    >
  </div>

  <div style="width: 100%; overflow-y: auto;">
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
