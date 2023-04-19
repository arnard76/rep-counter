<script>
  import { getPose } from "$lib/pose-detection/detector.js";
  import { drawCanvas, connectTheDots } from "$lib/visualizeKeypoints.js";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import Keypoint from "$lib/common-shapes/Keypoint.svelte";
  import KeypointsFilter from "$lib/inputs/SelectManyKeypoints.svelte";

  let cameraLiveFeedVideoEl = null;
  let keypointsOverlayCanvasEl = null;
  let stream = null;
  let keypoints = null;
  let hiddenKeypoints = Object.fromEntries(
    keypointNames.map((name) => [name, true])
  );
  let previousKeypoints = Object.fromEntries(
    keypointNames.map((name) => [name, []])
  );

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
    keypointsOverlayCanvasEl.width = videoWidth;
    keypointsOverlayCanvasEl.height = videoHeight;
    const ctx = keypointsOverlayCanvasEl.getContext("2d");

    getPose(cameraLiveFeedVideoEl).then((res) => {
      if (!res || !res.length) return;

      console.log(res);
      keypoints = res[0].keypoints;
      for (let keypoint of keypoints) {
        if (hiddenKeypoints[keypoint.name] === true) {
          if (previousKeypoints[keypoint.name].length) {
            previousKeypoints[keypoint.name] = [];
          }
          continue;
        }

        if (previousKeypoints[keypoint.name].length > 10) {
          previousKeypoints[keypoint.name].splice(0, 1);
        }
        previousKeypoints[keypoint.name].push(keypoint);
        connectTheDots(previousKeypoints[keypoint.name], ctx);
      }

      // drawCanvas(res[0], videoWidth, videoHeight, keypointsOverlayCanvasEl);
    });
  }, 100);

  onDestroy(() => {
    clearInterval(snapAndDetect);
  });
</script>

<KeypointsFilter {keypoints} {hiddenKeypoints} />

<div style="position: relative;">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video src="" bind:this={cameraLiveFeedVideoEl} />
  <div id="diagram" style="position:absolute; ">
    {#if keypoints}
      {#each keypoints as keypoint (keypoint)}
        {#if !hiddenKeypoints[keypoint.name]}
          <Keypoint {keypoint} />
        {/if}
      {/each}
    {/if}
  </div>

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

  #diagram {
    top: 0;
    left: 0;
  }
</style>
