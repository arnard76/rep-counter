<!-- List out all the KRA's of the focusLimb (plus delete KRA ability ) -->

<script lang="ts">
  import exercises from "$lib/exercises/store";
  import selectedKeyRepArea from "$lib/key-rep-area/selected";
  import SelectOneKeypointName from "$lib/pose-detection/SelectOneKeypoint.svelte";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";

  function deleteKRA(focusLimbName: string, KRA: KeyRepArea) {
    exercises.deleteKRAInSelectedExercise(focusLimbName, KRA);
  }

  export let focusLimbName: string;
  export let keyRepAreas: KeyRepArea[];
</script>

{#each keyRepAreas as keyRepArea, index (keyRepArea)}
  {@const { areaSize, topLeft } = keyRepArea}
  <div
    class="key-rep-area"
    style={`${
      $selectedKeyRepArea == keyRepArea
        ? "background-color: rgba(40,40,40,0.9); color: rgb(255,255,255);"
        : ""
    }`}
    on:dblclick={() => selectedKeyRepArea.select(keyRepArea)}
  >
    <p>{areaSize.width}x{areaSize.height}</p>
    <p>({topLeft.x}, {topLeft.y})</p>

    <SelectOneKeypointName
      {keypointNames}
      bind:selectedKeypoint={keyRepAreas[index].relativeToWhichKeypoint}
    />

    <button type="button" on:click={() => deleteKRA(focusLimbName, keyRepArea)}
      >delete🗑️</button
    >
  </div>
{/each}

<style>
  .key-rep-area {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .key-rep-area > p {
    width: 55%;
  }
</style>
