<script lang="ts">
  import type KeyRepArea from "$lib/key-rep-area/keyRepArea";
  import KeyRepAreaComponent from "$lib/key-rep-area/KeyRepArea.svelte";

  export let keyRepAreas: KeyRepArea[];
  export let keypoints: any[];
  export let focusKeypointName: string;
  export let startKeyRepAreaIsEnd: boolean | undefined = undefined;

  $: showingKeyRepAreas = startKeyRepAreaIsEnd
    ? [...keyRepAreas].slice(0, -1)
    : [...keyRepAreas];
</script>

{#each showingKeyRepAreas as keyRepArea, index (keyRepArea)}
  <KeyRepAreaComponent
    bind:keyRepArea={keyRepAreas[index]}
    {keypoints}
    focusKeypoint={focusKeypointName}
  />
{/each}
