<script>
  import { getPose } from "$lib/detector.js";
  import { drawCanvas, connectTheDots } from "$lib/drawKeypoints.js";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";
  import keypointNames from "$lib/keypointNames.json";

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
      if (!res) return;

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

  /**
   * @param {string} ogName
   */
  function getVerboseKeypointName(ogName) {
    return ogName.replace("_", " ");
  }
</script>

{#if keypoints}
  <div
    style="display:grid; max-width: 100vw; grid-template-columns: repeat(6, 100px);"
  >
    {#each keypoints as keypoint (keypoint.name)}
      <div style="display:flex; margin-inline: 50px;">
        <p>{getVerboseKeypointName(keypoint.name)}</p>
        <input
          type="checkbox"
          name=""
          id=""
          bind:checked={hiddenKeypoints[keypoint.name]}
        />
      </div>
    {/each}
  </div>
{/if}

<!-- svelte-ignore a11y-media-has-caption -->

<div style="position: relative;">
  <video src="" bind:this={cameraLiveFeedVideoEl} />
  <div id="diagram" style="position:absolute; ">
    {#if keypoints}
      {#each keypoints as keypoint (keypoint)}
        {#if !hiddenKeypoints[keypoint.name]}
          <div
            class="keypoint"
            style={`--x: ${keypoint.x}px; --y: ${keypoint.y}px;`}
          />
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
