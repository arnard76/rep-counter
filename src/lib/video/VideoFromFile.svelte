<script lang="ts">
  import videoEl from "./video";

  export let validVideoFile: File;
  $: if ($videoEl && validVideoFile) {
    $videoEl.src = URL.createObjectURL(validVideoFile); // set src to blob url
    console.log("setting src of video :)");
    $videoEl.play();
  }

  export let videoWidth: number, videoHeight: number;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  bind:this={$videoEl}
  bind:videoWidth
  bind:videoHeight
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
