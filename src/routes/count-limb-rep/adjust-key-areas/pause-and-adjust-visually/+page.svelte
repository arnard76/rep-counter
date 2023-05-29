<script>
  import { browser } from "$app/environment";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
  import {
    videoEl,
    paused,
    controlledKeypoints,
  } from "$lib/pose-detection/keypoints.js";

  import KeypointsOverlay from "$lib/common-shapes/KeypointsOverlay.svelte";
  import SelectOneKeypoint from "$lib/inputs/SelectOneKeypoint.svelte";
  import RepsCounter from "$lib/check-rep/RepsCounter.svelte";
  import KeyRepArea from "$lib/check-rep/keyRepArea.js";
  import KeyRepAreas from "$lib/check-rep/KeyRepAreas.svelte";

  let stream = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res))
      .catch((error) => {
        console.log("oops! the camera is not accessible for some reason 🥲🥲");
      });
  }

  $: if (stream) {
    $videoEl.srcObject = stream;
    $videoEl.play();
  }

  let keyRepAreas = [
    new KeyRepArea("right_elbow", { x: 200, y: 0 }, { width: 50, height: 50 }),
    new KeyRepArea("left_ear", { x: 100, y: 25 }, { width: 50, height: 30 }),
  ];

  keyRepAreas.push(keyRepAreas[0].cloneInstance());

  let focusKeypoint = "right_wrist";

  $: relativeAndFocusKeypoints =
    $controlledKeypoints &&
    $controlledKeypoints.filter(
      (keypoint) =>
        keyRepAreas.find(
          (keyRepArea) => keyRepArea.relativeToWhichKeypoint === keypoint.name
        ) || focusKeypoint === keypoint.name
    );

  let pauseDelay = 5;
</script>

<div class="container">
  <div class="inputs">
    {#each keyRepAreas as keyRepArea (keyRepArea)}
      <p>Key area relative to?</p>
      <SelectOneKeypoint
        {keypointNames}
        bind:selectedKeypoint={keyRepArea.relativeToWhichKeypoint}
      />
    {/each}
    <p>Where is the focus?</p>
    <SelectOneKeypoint {keypointNames} bind:selectedKeypoint={focusKeypoint} />
  </div>

  <!-- svelte-ignore a11y-media-has-caption -->

  <div style="position: relative;">
    <video src="" bind:this={$videoEl} />
    <RepsCounter {keyRepAreas} {focusKeypoint} />
    <KeypointsOverlay keypoints={relativeAndFocusKeypoints} />

    <!-- the divider so mouse events can interact with 👇 but not ☝️ -->
    <div class="divider" />

    <KeyRepAreas
      {keyRepAreas}
      keypoints={$controlledKeypoints}
      {focusKeypoint}
    />
  </div>

  <div
    style="display: flex; flex-direction: column;width: 150px; align-items:flex-start;"
  >
    <button
      on:click={() => {
        paused.toggle();
      }}
    >
      {$paused ? "play ▶️" : "pause ⏸️"}
    </button>

    {#if !$paused}
      <button
        on:click={() => {
          console.log(pauseDelay, typeof pauseDelay);
          setTimeout(() => {
            paused.toggle();
          }, pauseDelay * 1000);
        }}
        >pause in <input
          bind:value={pauseDelay}
          type="number"
          style="max-width: 50px;"
        /> s</button
      >{/if}
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

  .divider {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>