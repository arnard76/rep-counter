<script>
  import { submitPose } from "$lib/detector.js";
  import { captureVideo } from "$lib/frameCapture.js";
  import { drawCanvas } from "$lib/drawKeypoints.js";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";

  let videoEl = null;
  let imageSrcEl = null;
  let stream = null;
  let keypoints = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  let snapAndDetect;
  $: if (stream) {
    videoEl.srcObject = stream;
    videoEl.play();
  }

  snapAndDetect = setInterval(() => {
    if (!videoEl) return;

    // Get Video Properties
    const videoWidth = videoEl.videoWidth;
    const videoHeight = videoEl.videoHeight;

    // Set video width
    videoEl.width = videoWidth;
    videoEl.height = videoHeight;

    imageSrcEl.src = captureVideo(videoEl);

    submitPose(videoEl).then((res) => {
      if (!res) return;
      console.log(res);
      keypoints = res[0].keypoints;
    });
  }, 500);

  onDestroy(() => {
    clearInterval(snapAndDetect);
  });
</script>

<!-- svelte-ignore a11y-media-has-caption -->

<div style="position:relative;">
  <video src="" bind:this={videoEl} />
  <img
    src=""
    alt="latest-snapshot-from-video-stream"
    style="display:none;"
    bind:this={imageSrcEl}
  />
  <div id="diagram" style="position:absolute; ">
    {#if keypoints}
      {#each keypoints as keypoint (keypoint)}
        <div
          class="keypoint"
          style={`--x: ${keypoint.x}px; --y: ${keypoint.y}px;`}
        />
      {/each}
    {/if}
  </div>
</div>

<style>
  #diagram {
    top: 0;
    left: 0;
  }

  .keypoint {
    --x: 0;
    --y: 0;
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 0, 25, 0.7);
    border-radius: 30%;
    transform: translate(var(--x), var(--y));
  }
</style>
