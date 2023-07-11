<script>
  import { browser } from "$app/environment";
  import getLiveVideo, {
    stopUsingUserMedia,
    loading,
  } from "$legacy-pages-lib/video/liveVideo";
  import videoEl from "$legacy-pages-lib/video/video";
  import { onDestroy } from "svelte";

  if (browser) getLiveVideo();

  onDestroy(async () => {
    while (loading) {
      await new Promise((res) => setTimeout(res, 5000));
    }

    stopUsingUserMedia();
  });

  export let videoWidth, videoHeight;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={$videoEl} bind:videoWidth bind:videoHeight />

<style>
  video {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>
