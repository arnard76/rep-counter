<script>
  import { browser } from "$app/environment";
  import { getPose } from "$lib/pose-detection/detector.js";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import { drawCanvas, connectTheDots } from "$lib/visualizeKeypoints.js";
  import { onDestroy } from "svelte";

  import Keypoint from "$lib/common-shapes/Keypoint.svelte";
  import SelectOneKeypoint from "$lib/inputs/SelectOneKeypoint.svelte";
  import KeyRepArea from "$lib/check-rep/KeyRepArea.svelte";

  let cameraLiveFeedVideoEl = null;
  let keypointsOverlayCanvasEl = null;
  let stream = null;
  let keypoints = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  $: if (stream) {
    cameraLiveFeedVideoEl.srcObject = stream;
    cameraLiveFeedVideoEl.play();
  }

  let snapAndDetect;
  snapAndDetect = setInterval(() => {
    if (!cameraLiveFeedVideoEl) return;

    // Get Video Properties
    const videoWidth = cameraLiveFeedVideoEl.videoWidth;
    const videoHeight = cameraLiveFeedVideoEl.videoHeight;
    keypointsOverlayCanvasEl.width = videoWidth;
    keypointsOverlayCanvasEl.height = videoHeight;
    const ctx = keypointsOverlayCanvasEl.getContext("2d");

    getPose(cameraLiveFeedVideoEl).then((res) => {
      if (!res || !res.length) return;

      // console.log(res);
      keypoints = res[0].keypoints;
    });
  }, 100);

  onDestroy(() => {
    clearInterval(snapAndDetect);
  });

  let focusKeypointName;
</script>

<div class="container">
  <div>
    <p>Where is the focus?</p>
    <SelectOneKeypoint {keypoints} bind:selectedKeypoint={focusKeypointName} />
  </div>

  <!-- svelte-ignore a11y-media-has-caption -->

  <div style="position: relative;">
    <video src="" bind:this={cameraLiveFeedVideoEl} />
    <KeyRepArea
      relativeToWhichKeypoint={"nose"}
      {keypoints}
      focusKeypoint={keypoints &&
        keypoints.find((keypoint) => keypoint.name === focusKeypointName)}
    />
    <div id="diagram" style="position:absolute;">
      {#if keypoints}
        {#each keypoints as keypoint (keypoint)}
          {#if keypoint.name === "nose" || focusKeypointName === keypoint.name}
            <Keypoint {keypoint} />
          {/if}
        {/each}
      {/if}
    </div>

    <canvas bind:this={keypointsOverlayCanvasEl} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
    justify-content: left;
  }

  canvas {
    position: absolute;
    top: 0px;
    border: 2px solid black;
    left: 0px;
    z-index: 9;
  }

  #diagram {
    top: 0;
    left: 0;
  }
</style>
