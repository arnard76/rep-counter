<script>
  import { getPose } from "$lib/detector.js";
  import { captureVideo } from "$lib/frameCapture.js";
  import { browser } from "$app/environment";
  import Keypoint from "$lib/Keypoint.svelte";

  let videoEl = null;
  let imageSrcEl = null;
  let stream = null;
  let keypoints = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  $: if (stream) {
    videoEl.srcObject = stream;
    videoEl.play();
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={videoEl} />
<button
  on:click={() => {
    imageSrcEl.src = captureVideo(videoEl);

    getPose(videoEl).then((res) => {
      if (!res) return;

      console.log(res);
      keypoints = res[0].keypoints;
    });
  }}
  >get frame & detect pose 📷🧘😎
</button>

<div style="position:relative;">
  <img src="" alt="latest-snapshot-from-video-stream" bind:this={imageSrcEl} />
  <div id="diagram" style="position:absolute; ">
    {#if keypoints}
      {#each keypoints as keypoint (keypoint)}
        <Keypoint {keypoint} />
      {/each}
    {/if}
  </div>
</div>

<style>
  #diagram {
    top: 0;
    left: 0;
  }
</style>
