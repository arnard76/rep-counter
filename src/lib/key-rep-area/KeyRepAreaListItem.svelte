<script lang="ts">
  import { controlledKeypoints } from "$lib/pose-detection/otherKeypointStores";
  import type KeyRepArea from "./keyRepArea";
  import selectedKeyRepArea from "./selected";

  import SelectOneKeypointName from "$lib/pose-detection/SelectOneKeypoint.svelte";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import EditTopLeftText from "./EditTopLeftText.svelte";
  import EditAreaSizeValues from "./EditAreaSizeValues.svelte";

  export let keyRepArea: KeyRepArea;
  $: ({ relativeToWhichKeypoint, areaSize, topLeft } = keyRepArea);
  export let updateKeyRepArea: (updated: KeyRepArea) => void;
  export let deleteKeyRepArea: (updated: KeyRepArea) => void;

  const changeRelativeKeypoint = ({ target }: Event) => {
    keyRepArea.relativeToWhichKeypoint = (
      target as HTMLSelectElement
    ).selectedOptions[0].value;
    updateKeyRepArea(keyRepArea);
  };
</script>

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
    on:change={changeRelativeKeypoint}
  />

  <EditTopLeftText
    {topLeft}
    updateTopLeft={(updated) => {
      keyRepArea.topLeft = updated;
      updateKeyRepArea(keyRepArea);
    }}
  >
    <p>
      ({keyRepArea.evaluateTopLeftToNumber($controlledKeypoints).x},
      {keyRepArea.evaluateTopLeftToNumber($controlledKeypoints).y})
    </p>
  </EditTopLeftText>

  <EditAreaSizeValues
    {areaSize}
    updateAreaSize={(updated) => {
      keyRepArea.areaSize = updated;
      updateKeyRepArea(keyRepArea);
    }}
  >
    <p>{areaSize.width}x{areaSize.height}</p>
  </EditAreaSizeValues>

  <button on:click={() => deleteKeyRepArea(keyRepArea)}>🗑️</button>
</div>

<style>
  .key-rep-area {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .key-rep-area > * {
    width: 35%;
    text-align: center;
  }

  .key-rep-area > button,
  button {
    width: initial;
    background-color: black;
    cursor: pointer;
  }
</style>
