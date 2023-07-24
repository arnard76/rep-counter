<!-- List out all the KRA's of the focusLimb (plus delete KRA ability ) -->

<script lang="ts">
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";
  import KeyRepAreaListItem from "$lib/key-rep-area/KeyRepAreaListItem.svelte";

  export let keyRepAreas: KeyRepArea[];
  export let startKeyRepAreaIsEnd: boolean;
  export let updateKeyRepAreas: (updated: KeyRepArea[]) => void;

  function deleteKRA(KRA: KeyRepArea) {
    keyRepAreas.splice(keyRepAreas.indexOf(KRA), 1);
    updateKeyRepAreas(keyRepAreas);
  }

  $: showingKeyRepAreas = startKeyRepAreaIsEnd
    ? [...keyRepAreas, keyRepAreas[0]]
    : keyRepAreas;
</script>

{#each showingKeyRepAreas as keyRepArea, index (index)}
  <KeyRepAreaListItem
    {keyRepArea}
    updateKeyRepArea={(updated) => {
      keyRepAreas[index % keyRepAreas.length] = updated;
      updateKeyRepAreas(keyRepAreas);
    }}
    deleteKeyRepArea={deleteKRA}
  />
{/each}
