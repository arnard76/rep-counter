<script lang="ts">
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";
  import KeyRepAreaComponent from "$lib/key-rep-area/KeyRepArea.svelte";

  export let keyRepAreas: KeyRepArea[];
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
    focusKeypoint={focusKeypointName}
  />
{/each}
