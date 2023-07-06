<!-- List out all the KRA's of the focusLimb (plus delete KRA ability ) -->

<script lang="ts">
  import selectedKeyRepArea from "$lib/key-rep-area/selected";
  import SelectOneKeypointName from "$lib/pose-detection/SelectOneKeypoint.svelte";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";

  export let keyRepAreas: KeyRepArea[];
  export let startKeyRepAreaIsEnd: boolean;
  export let updateKeyRepAreas: (updated: KeyRepArea[]) => void;

  function deleteKRA(KRA: KeyRepArea) {
    keyRepAreas.splice(keyRepAreas.indexOf(KRA), 1);
    updateKeyRepAreas(keyRepAreas);
  }

  const onRelativeKeypointChange = ({ target }: Event, index: number) => {
    showingKeyRepAreas[index].relativeToWhichKeypoint = (
      target as HTMLSelectElement
    ).selectedOptions[0].value;
    updateKeyRepAreas(keyRepAreas);
  };

  $: showingKeyRepAreas = startKeyRepAreaIsEnd
    ? [...keyRepAreas, keyRepAreas[0]]
    : keyRepAreas;
</script>

{#each showingKeyRepAreas as keyRepArea, index (index)}
  {@const { relativeToWhichKeypoint, topLeft, areaSize } = keyRepArea}
  <div
    class="key-rep-area"
    style={`${
      $selectedKeyRepArea == keyRepArea
        ? "background-color: rgba(40,40,40,0.9); color: rgb(255,255,255);"
        : ""
    }`}
    on:dblclick={() => selectedKeyRepArea.select(keyRepArea)}
  >
    <SelectOneKeypointName
      {keypointNames}
      selectedKeypoint={relativeToWhichKeypoint}
      on:change={(e) => onRelativeKeypointChange(e, index)}
    />

    <p>({topLeft.x}, {topLeft.y})</p>
    <p>{areaSize.width}x{areaSize.height}</p>

    <button on:click={() => deleteKRA(keyRepArea)}>🗑️</button>
  </div>
{/each}

<style>
  .key-rep-area {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .key-rep-area > p {
    width: 55%;
    text-align: center;
  }

  button {
    background-color: black;
    cursor: pointer;
  }
</style>
