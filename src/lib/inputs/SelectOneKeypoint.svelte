<script>
  import { getVerboseKeypointName } from "$lib/transformKeypointData.js";

  export let keypointNames;

  export let selectedKeypoint = null;
</script>

{#if keypointNames}
  <div
    style="display:grid; max-width: 100vw; grid-template-columns: repeat(6, 100px);"
  >
    {#each keypointNames as keypointName (keypointName)}
      <div style="display:flex; margin-inline: 50px;">
        <p>{getVerboseKeypointName(keypointName)}</p>

        <input
          type="radio"
          bind:group={selectedKeypoint}
          value={keypointName}
        />
      </div>
    {/each}
  </div>
{/if}
