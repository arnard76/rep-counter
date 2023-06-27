<script>
  import { browser } from "$app/environment";
  import getLiveVideo, { stopUsingUserMedia } from "$lib/video/liveVideo";
  import videoEl from "$lib/video/video";
  import { onDestroy } from "svelte";

  if (browser) getLiveVideo();

  onDestroy(stopUsingUserMedia);
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={$videoEl} />
