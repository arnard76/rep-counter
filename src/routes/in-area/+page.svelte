<script>
  import { browser } from "$app/environment";
  import { videoEl } from "$lib/video/getUserVideo.js";
  import { keypoints } from "$lib/pose-detection/keypoints.js";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import repArea from "$lib/check-rep/keyRepArea.js";

  import KeypointsOverlay from "$lib/common-shapes/KeypointsOverlay.svelte";
  import SelectOneKeypoint from "$lib/inputs/SelectOneKeypoint.svelte";
  import KeyRepArea from "$lib/check-rep/KeyRepArea.svelte";

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
    new repArea("right_ear", { x: 1, y: 2 }, { width: 50, height: 30 }),
    new repArea("left_ear", { x: 100, y: 25 }, { width: 50, height: 30 }),
  ];
  let focusKeypoints = ["right_wrist", "right_wrist"];

  $: keypointsToShow =
    $keypoints &&
    $keypoints.filter(
      (keypoint) =>
        keyRepAreas.find(
          (keyRepArea) => keyRepArea.relativeToWhichKeypoint === keypoint.name
        ) || focusKeypoints.includes(keypoint.name)
    );
</script>

<div class="container">
  {#each keyRepAreas as keyRepArea, index (keyRepArea)}
    <div>
      <p>Key area relative to?</p>
      <SelectOneKeypoint
        {keypointNames}
        bind:selectedKeypoint={keyRepArea.relativeToWhichKeypoint}
      />
    </div>
    <div>
      <p>Where is the focus?</p>
      <SelectOneKeypoint
        {keypointNames}
        bind:selectedKeypoint={focusKeypoints[index]}
      />
    </div>
  {/each}

  <!-- svelte-ignore a11y-media-has-caption -->

  <div style="position: relative;">
    <video src="" bind:this={$videoEl} />

    {#each keyRepAreas as keyRepArea, index (keyRepArea)}
      <KeyRepArea
        {keyRepArea}
        keypoints={$keypoints}
        focusKeypoint={focusKeypoints[index]}
      />
    {/each}

    <KeypointsOverlay keypoints={keypointsToShow} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
    justify-content: left;
  }
</style>
