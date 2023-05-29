<script>
  import { captureVideo } from "$lib/video/frameCapture.js";
  import { getPose } from "$lib/pose-detection/detector.js";
  import { drawCanvas } from "$lib/pose-detection/visualizeKeypoints.js";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";
  import KeypointsOverlay from "$lib/common-shapes/KeypointsOverlay.svelte";

  let cameraLiveFeedVideoEl = null;
  let snapshotFrameImgEl = null;
  let keypointsOverlayCanvasEl = null;
  let stream = null;
  let keypoints = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  let snapAndDetect;
  $: if (stream) {
    cameraLiveFeedVideoEl.srcObject = stream;
    cameraLiveFeedVideoEl.play();
  }

  snapAndDetect = setInterval(() => {
    if (!cameraLiveFeedVideoEl) return;

    // Get Video Properties
    const videoWidth = cameraLiveFeedVideoEl.videoWidth;
    const videoHeight = cameraLiveFeedVideoEl.videoHeight;

    // snapshotFrameImgEl.src = captureVideo(cameraLiveFeedVideoEl);

    getPose(cameraLiveFeedVideoEl).then((res) => {
      if (!res) return;

      console.log(res);
      keypoints = res[0].keypoints;
      drawCanvas(res[0], videoWidth, videoHeight, keypointsOverlayCanvasEl);
    });
  }, 100);

  onDestroy(() => {
    clearInterval(snapAndDetect);
  });
</script>

<!-- svelte-ignore a11y-media-has-caption -->

<div style="position: relative;">
  <video src="" bind:this={cameraLiveFeedVideoEl} />
  <KeypointsOverlay {keypoints} />

  <!-- <img
    src=""
    style="display:none;"
    alt="latest-snapshot-from-video-stream"
    bind:this={snapshotFrameImgEl}
  /> -->
  <canvas bind:this={keypointsOverlayCanvasEl} />
</div>

<style>
  canvas {
    position: absolute;
    top: 0px;
    border: 2px solid black;
    left: 0px;
    z-index: 9;
  }
</style>
