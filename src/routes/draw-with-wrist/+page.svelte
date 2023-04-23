<script>
  import { browser } from "$app/environment";
  import { videoEl, keypoints } from "$lib/pose-detection/keypoints.js";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import { connectTheDots } from "$lib/visualizeKeypoints.js";

  import Keypoint from "$lib/common-shapes/Keypoint.svelte";
  import SelectMany from "$lib/inputs/SelectManyKeypoints.svelte";

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
  <div id="diagram" style="position:absolute; ">
    {#if $keypoints}
      {#each $keypoints as keypoint (keypoint)}
        {#if visibleKeypoints.includes(keypoint.name)}
          <Keypoint {keypoint} />
        {/if}
      {/each}
    {/if}
  </div>

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

  #diagram {
    top: 0;
    left: 0;
  }
</style>
