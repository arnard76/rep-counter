<script>
  import Keypoint from "$lib/common-shapes/Keypoint.svelte";

  export let keypoints;
</script>

<div id="diagram" style="position:absolute;">
  {#if keypoints}
    {#each keypoints as keypoint (keypoint)}
      <Keypoint {keypoint} />
    {/each}
  {/if}
</div>

<style>
  #diagram {
    top: 0;
    left: 0;
  }
</style>
