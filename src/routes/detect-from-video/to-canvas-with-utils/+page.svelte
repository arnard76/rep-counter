<script>
  import { getPose } from "$lib/detector.js";
  import { captureVideo } from "$lib/frameCapture.js";
  import { browser } from "$app/environment";
  import { drawCanvas } from "$lib/visualizeKeypoints.js";

  let videoEl = null;
  let imageSrcEl = null;
  let canvasEl = null;
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

  function snapAndDetect() {
    // Get Video Properties
    const videoWidth = videoEl.videoWidth;
    const videoHeight = videoEl.videoHeight;

    imageSrcEl.src = captureVideo(videoEl);

    getPose(videoEl).then((res) => {
      if (!res) return;

      console.log(res);
      keypoints = res[0].keypoints;
      drawCanvas(res[0], videoWidth, videoHeight, canvasEl);
    });
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={videoEl} />

<button
  on:click={() => {
    snapAndDetect();
  }}>snap & detect this frame</button
>

<div style="position: relative;">
  <img src="" alt="latest-snapshot-from-video-stream" bind:this={imageSrcEl} />
  <canvas bind:this={canvasEl} />
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
