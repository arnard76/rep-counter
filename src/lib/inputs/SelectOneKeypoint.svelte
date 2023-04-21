<script>
  import { getVerboseKeypointName } from "$lib/transformKeypointData.js";

  export let keypointNames;
  export let selectedKeypoint = null;
</script>

{#if keypointNames}
  <select bind:value={selectedKeypoint}>
    {#each keypointNames as keypointName (keypointName)}
      <option value={keypointName}
        >{getVerboseKeypointName(keypointName)}</option
      >
    {/each}
  </select>
{/if}
