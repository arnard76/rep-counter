<script>
  import { browser } from "$app/environment";
  import getUserVideo, { videoEl } from "$lib/video/getUserVideo.js";

  if (browser) getUserVideo();
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={$videoEl} />
