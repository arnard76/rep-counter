<script lang="ts">
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";
  import KeyRepAreaComponent from "$lib/key-rep-area/KeyRepArea.svelte";

  export let keyRepAreas: KeyRepArea[];
  export let keypoints: any[];
  export let focusKeypointName: string;
  export let updateKeyRepAreas: (updated: KeyRepArea[]) => void;
</script>

{#each keyRepAreas as keyRepArea, index (keyRepArea)}
  <KeyRepAreaComponent
    {keyRepArea}
    updateKeyRepAreas={(updated) => {
      keyRepAreas[index] = updated;
      updateKeyRepAreas(keyRepAreas);
    }}
    {keypoints}
    focusKeypoint={focusKeypointName}
  />
{/each}
