<script lang="ts">
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";
  import KeyRepAreaComponent from "$lib/key-rep-area/KeyRepArea.svelte";

  export let keyRepAreas: KeyRepArea[];
  export let keypoints: any[];
  export let focusKeypointName: string;
  export let startKeyRepAreaIsEnd: boolean | undefined = undefined;

  let showingKeyRepAreas: KeyRepArea[];
  $: if (startKeyRepAreaIsEnd) {
    showingKeyRepAreas = [...keyRepAreas];
    showingKeyRepAreas.pop();
  }
</script>

{#each startKeyRepAreaIsEnd ? showingKeyRepAreas : keyRepAreas as keyRepArea, index (keyRepArea)}
  <KeyRepAreaComponent
    bind:keyRepArea={keyRepAreas[index]}
    {keypoints}
    focusKeypoint={focusKeypointName}
  />
{/each}
