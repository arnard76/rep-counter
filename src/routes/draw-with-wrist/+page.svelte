<script>
  import { browser } from "$app/environment";
  import videoEl from "$lib/video/video";
  import keypoints from "$lib/pose-detection/keypoints.js";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import { connectTheDots } from "$lib/pose-detection/visualizeKeypoints.js";

  import SelectMany from "$lib/pose-detection/SelectManyKeypoints.svelte";
  import KeypointsOverlay from "$lib/pose-detection/KeypointsOverlay.svelte";

  let stream = null;

  let keypointsOverlayCanvasEl = null;
  let visibleKeypoints = []; // or [...keypointNames]
  let previousKeypoints = Object.fromEntries(
    keypointNames.map((name) => [name, []])
  );

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  $: if (stream) {
    $videoEl.srcObject = stream;
    $videoEl.play();
  }

  // draw previous points on canvas using utils
  $: if ($keypoints && keypointsOverlayCanvasEl) {
    const videoWidth = $videoEl.videoWidth;
    const videoHeight = $videoEl.videoHeight;
    keypointsOverlayCanvasEl.width = videoWidth;
    keypointsOverlayCanvasEl.height = videoHeight;
    const ctx = keypointsOverlayCanvasEl.getContext("2d");

    for (let keypoint of $keypoints) {
      if (!visibleKeypoints.includes(keypoint.name)) {
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
  }
</script>

<div style="position: relative;">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video src="" bind:this={$videoEl} />

  <KeypointsOverlay keypoints={$keypoints} />

  <canvas bind:this={keypointsOverlayCanvasEl} />
</div>

<SelectMany {keypointNames} bind:selectedKeypoints={visibleKeypoints} />

<style>
  canvas {
    position: absolute;
    top: 0px;
    border: 2px solid black;
    left: 0px;
    z-index: 9;
  }
</style>
