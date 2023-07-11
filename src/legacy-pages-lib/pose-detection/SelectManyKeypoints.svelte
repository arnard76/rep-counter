<script lang="ts">
  import { getVerboseKeypointName } from "$legacy-pages-lib/pose-detection/transformKeypointData.js";

  export let selectedKeypoints: string[] = [],
    keypointNames: string[];

  export let selectOpen = false;

  function formatSelected(selected: string[]) {
    let formatted = selected.length
      ? selected.join(",")
      : "No options selected";

    return formatted.length > 20 ? formatted.slice(0, 17) + "..." : formatted;
  }
</script>

{#if keypointNames}
  <div class="input-container">
    <button on:click={() => (selectOpen = !selectOpen)}>
      {formatSelected(selectedKeypoints)}
    </button>

    {#if selectOpen}
      <select multiple bind:value={selectedKeypoints}>
        {#each keypointNames as keypointName}
          <option value={keypointName}>
            {getVerboseKeypointName(keypointName)}
          </option>
        {/each}
      </select>
    {/if}
  </div>
{/if}

<style>
  .input-container {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  button {
    background-color: rgb(148, 210, 177);
    outline: none;
    border: none;
    padding: 0;
    box-sizing: border-box;
    margin: 0;
  }

  select {
    position: absolute;
    top: 100%;
  }
</style>
