<script>
  import { browser } from "$app/environment";
  import { videoEl } from "$lib/video/getUserVideo.js";
  import { keypoints } from "$lib/pose-detection/keypoints.js";
  import keypointNames from "$lib/pose-detection/keypointNames.json";

  import KeypointsOverlay from "$lib/common-shapes/KeypointsOverlay.svelte";
  import SelectOneKeypoint from "$lib/inputs/SelectOneKeypoint.svelte";
  import LimbRepCounter from "$lib/check-rep/LimbRepCounter.svelte";
  import KeyRepArea from "$lib/check-rep/keyRepArea.js";
  import KeyRepAreaSC from "$lib/check-rep/KeyRepArea.svelte";

  let stream = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  $: if (stream) {
    $videoEl.srcObject = stream;
    $videoEl.play();
  }

  let keyRepAreas = [
    new KeyRepArea("right_ear", { x: 1, y: 2 }, { width: 50, height: 30 }),
    new KeyRepArea("left_ear", { x: 100, y: 25 }, { width: 50, height: 30 }),
    new KeyRepArea("right_ear", { x: 1, y: 2 }, { width: 50, height: 30 }),
  ];

  let focusKeypoint = "right_wrist";

  $: keypointsToShow =
    $keypoints &&
    $keypoints.filter(
      (keypoint) =>
        keyRepAreas.find(
          (keyRepArea) => keyRepArea.relativeToWhichKeypoint === keypoint.name
        ) || focusKeypoint === keypoint.name
    );
</script>

<div class="container">
  <div class="inputs">
    {#each keyRepAreas as keyRepArea, index (keyRepArea)}
      <p>Key area relative to?</p>
      <SelectOneKeypoint
        {keypointNames}
        bind:selectedKeypoint={keyRepArea.relativeToWhichKeypoint}
      />

      <input
        placeholder="areaSize height"
        type="number"
        on:change={({ target }) =>
          (keyRepArea.areaSize.height = parseInt(target.value))}
      />
      <input
        placeholder="areaSize width"
        type="number"
        on:change={({ target }) =>
          (keyRepArea.areaSize.width = parseInt(target.value))}
      />
      <input
        placeholder="topLeft x"
        type="number"
        on:change={({ target }) =>
          (keyRepArea.topLeft.x = parseInt(target.value))}
      />
      <input
        placeholder="topLeft y"
        type="number"
        on:change={({ target }) =>
          (keyRepArea.topLeft.y = parseInt(target.value))}
      />
    {/each}
    <p>Where is the focus?</p>
    <SelectOneKeypoint {keypointNames} bind:selectedKeypoint={focusKeypoint} />
  </div>

  <!-- svelte-ignore a11y-media-has-caption -->

  <div style="position: relative;">
    <video src="" bind:this={$videoEl} />

    <LimbRepCounter {keyRepAreas} {focusKeypoint} />

    <KeypointsOverlay keypoints={keypointsToShow} />

    {#each keyRepAreas as keyRepArea (keyRepArea)}
      <KeyRepAreaSC {keyRepArea} keypoints={$keypoints} {focusKeypoint} />
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
    justify-content: left;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    overflow-y: auto;
  }
</style>
