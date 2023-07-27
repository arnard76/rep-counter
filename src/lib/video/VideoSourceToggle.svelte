<script lang="ts">
  import InputVideoFile from "./InputVideoFile.svelte";
  import ToggleInput from "./ToggleInput.svelte";

  export let live: boolean;
  export let validVideoFile: File;

  $: console.log(live);
</script>

<p>Select source for exercise video</p>
<div style="display: flex; align-items: center; gap: 10px;">
  <p>Video file</p>
  <ToggleInput bind:toggle={live} />
  <p>Live feed using camera</p>
</div>

{#if !live}
  <InputVideoFile updateVideoFile={(updated) => (validVideoFile = updated)} />
{/if}
