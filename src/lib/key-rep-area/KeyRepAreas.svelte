<script>
  import KeyRepArea from "$lib/key-rep-area/keyRepArea.svelte";

  export let keyRepAreas;
  export let keypoints;
  export let focusKeypoint;
</script>

{#each keyRepAreas as keyRepArea (keyRepArea)}
  <KeyRepArea {keyRepArea} {keypoints} {focusKeypoint} />
{/each}
