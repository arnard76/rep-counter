<script lang="ts">
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";
  import KeyRepAreaComponent from "$lib/key-rep-area/KeyRepArea.svelte";

  export let keyRepAreas: KeyRepArea[];
  export let keypoints: any[];
  export let focusKeypointName: string;
  export let startKeyRepAreaIsEnd: boolean | undefined = undefined;
  export let updateKeyRepAreas: (updated: KeyRepArea[]) => void;

  $: showingKeyRepAreas = startKeyRepAreaIsEnd
    ? [...keyRepAreas].slice(0, -1)
    : [...keyRepAreas];
</script>

{#each showingKeyRepAreas as keyRepArea, index (keyRepArea)}
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
