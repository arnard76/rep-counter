<script lang="ts">
  import type { Readable } from "svelte/store";
  import videoEl from "./video";

  export let validVideoFile: Readable<File>;
  $: if ($videoEl && $validVideoFile) {
    $videoEl.src = URL.createObjectURL($validVideoFile); // set src to blob url
    console.log("setting src of video :)");
    $videoEl.play();
  }

  export let videoWidth: number, videoHeight: number;
  export let fallback = null;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  bind:this={$videoEl}
  bind:videoWidth
  bind:videoHeight
  src={fallback}
  title="the uploaded video file🤞"
  loop
  muted
  autoplay
/>

<style>
  video {
    width: 100%;
    height: 100%;
  }
</style>
