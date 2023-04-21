<script>
  import { getVerboseKeypointName } from "$lib/transformKeypointData.js";

  export let hiddenKeypoints, keypointNames;
</script>

{#if keypointNames}
  <div
    style="display:grid; max-width: 100vw; grid-template-columns: repeat(6, 100px);"
  >
    {#each keypointNames as keypointName (keypointName)}
      <div style="display:flex; margin-inline: 50px;">
        <p>{getVerboseKeypointName(keypointName)}</p>

        <input
          type="checkbox"
          name=""
          id=""
          bind:checked={hiddenKeypoints[keypointName]}
        />
      </div>
    {/each}
  </div>
{/if}
