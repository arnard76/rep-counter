<script>
  import { getVerboseKeypointName } from "$lib/transformKeypointData.js";

  export let hiddenKeypoints, keypoints;
</script>

{#if keypoints}
  <div
    style="display:grid; max-width: 100vw; grid-template-columns: repeat(6, 100px);"
  >
    {#each keypoints as keypoint (keypoint.name)}
      <div style="display:flex; margin-inline: 50px;">
        <p>{getVerboseKeypointName(keypoint.name)}</p>

        <input
          type="checkbox"
          name=""
          id=""
          bind:checked={hiddenKeypoints[keypoint.name]}
        />
      </div>
    {/each}
  </div>
{/if}
