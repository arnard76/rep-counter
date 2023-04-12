<script>
  import { submitPose } from "$lib/detector.js";
  import { captureVideo } from "$lib/frameCapture.js";
  import { browser } from "$app/environment";
  import { drawKeypoints } from "$lib/drawKeypoints.js";

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

  function drawCanvas(pose, video, videoWidth, videoHeight, canvas) {
    console.log(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.0, ctx);
    // drawSkeleton(pose["keypoints"], 0.7, ctx);
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={videoEl} />
<button
  on:click={() => {
    // console.log(videoEl, videoEl.);
    // Get Video Properties
    const videoWidth = videoEl.videoWidth;
    const videoHeight = videoEl.videoHeight;
    console.log(videoWidth, videoHeight);

    // Set video width
    videoEl.width = videoWidth;
    videoEl.height = videoHeight;

    imageSrcEl.src = captureVideo(videoEl);
    // imageSrcEl.style.width = "640px";
    // imageSrcEl.style.height = "480px";
    // console.log(imageSrcEl);

    submitPose(videoEl).then((res) => {
      console.log(res);
      keypoints = res[0].keypoints;

      drawCanvas(res[0], videoEl, 640, 480, canvasEl);
    });
  }}>update the canvas 😎</button
>

<img src="" alt="latest-snapshot-from-video-stream" bind:this={imageSrcEl} />

<canvas
  bind:this={canvasEl}
  style="
    "
/>

<style>
  canvas {
    position: "absolute";
    margin-left: "auto";
    margin-right: "auto";
    left: 0;
    right: 0;
    text-align: "center";
    z-index: 9;
    width: 640;
    height: 480;
  }
</style>
