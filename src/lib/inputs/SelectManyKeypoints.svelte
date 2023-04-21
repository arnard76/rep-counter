<script>
  import { getVerboseKeypointName } from "$lib/transformKeypointData.js";

  export let selectedKeypoints = [],
    keypointNames;
</script>

{#if keypointNames}
  <select multiple bind:value={selectedKeypoints}>
    {#each keypointNames as keypointName}
      <option value={keypointName}>
        {getVerboseKeypointName(keypointName)}
      </option>
    {/each}
  </select>
{/if}
