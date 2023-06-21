<script>
  import KeyRepArea from "$lib/key-rep-area/KeyRepArea.svelte";

  export let keyRepAreas;
  export let keypoints;
  export let focusKeypoint;
  export let startKeyRepAreaIsEnd = undefined;

  let showingKeyRepAreas;
  $: if (startKeyRepAreaIsEnd) {
    showingKeyRepAreas = [...keyRepAreas];
    showingKeyRepAreas.pop();
  }
</script>

{#each startKeyRepAreaIsEnd ? showingKeyRepAreas : keyRepAreas as keyRepArea (keyRepArea)}
  <KeyRepArea bind:keyRepArea {keypoints} {focusKeypoint} />
{/each}
