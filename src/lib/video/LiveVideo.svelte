<script>
  import { browser } from "$app/environment";
  import getLiveVideo from "$lib/video/liveVideo.js";
  import videoEl from "$lib/video/video";

  if (browser) getLiveVideo();
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={$videoEl} />
