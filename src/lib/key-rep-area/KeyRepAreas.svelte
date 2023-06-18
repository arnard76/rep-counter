<script>
  import KeyRepArea from "$lib/key-rep-area/KeyRepArea.svelte";

  export let keyRepAreas;
  export let keypoints;
  export let focusKeypoint;
</script>

{#each keyRepAreas as keyRepArea (keyRepArea)}
  <KeyRepArea bind:keyRepArea {keypoints} {focusKeypoint} />
{/each}
