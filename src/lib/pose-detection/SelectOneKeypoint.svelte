<script>
  import { getVerboseKeypointName } from "$lib/pose-detection/transformKeypointData.js";

  export let keypointNames;
  export let selectedKeypoint = null;
</script>

{#if keypointNames}
  <select bind:value={selectedKeypoint} on:change>
    {#each keypointNames as keypointName (keypointName)}
      <option value={keypointName}
        >{getVerboseKeypointName(keypointName)}</option
      >
    {/each}
  </select>
{/if}
