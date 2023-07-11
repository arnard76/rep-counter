<script lang="ts">
  import type KeyRepArea from "$legacy-pages-lib/key-rep-area/keyRepArea";
  import KeyRepAreaComponent from "$legacy-pages-lib/key-rep-area/KeyRepArea.svelte";
  import type { keypoint } from "$legacy-pages-lib/pose-detection";

  export let keyRepAreas: KeyRepArea[];
  export let keypoints: keypoint[];
  export let focusKeypointName: string;
  export let updateKeyRepAreas: (updated: KeyRepArea[]) => void;
</script>

{#each keyRepAreas as keyRepArea, index (keyRepArea)}
  <KeyRepAreaComponent
    {keyRepArea}
    updateKeyRepArea={(updated) => {
      keyRepAreas[index] = updated;
      updateKeyRepAreas(keyRepAreas);
    }}
    {keypoints}
    focusKeypoint={focusKeypointName}
  />
{/each}
