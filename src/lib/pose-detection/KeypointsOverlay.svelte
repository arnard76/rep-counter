<script>
  import Keypoint from "$lib/pose-detection/Keypoint.svelte";

  export let keypoints;
  export let colourTheme = null;
</script>

<div id="diagram" style="position:absolute;">
  {#if keypoints}
    {#each keypoints as keypoint (keypoint)}
      <Keypoint {keypoint} colour={colourTheme} />
    {/each}
  {/if}
</div>

<style>
  #diagram {
    top: 0;
    left: 0;
  }
</style>
