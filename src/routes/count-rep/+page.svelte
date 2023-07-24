<script>
  import { browser } from "$app/environment";
  import videoEl from "$legacy-pages-lib/video/video";
  import keypointNames from "$legacy-pages-lib/pose-detection/keypointNames.json";
  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$legacy-pages-lib/pose-detection/otherKeypointStores";
  import { paused } from "$legacy-pages-lib/paused";

  import KeypointsOverlay from "$legacy-pages-lib/pose-detection/KeypointsOverlay.svelte";
  import SelectOneKeypoint from "$legacy-pages-lib/pose-detection/SelectOneKeypoint.svelte";
  import KeyRepArea from "$legacy-pages-lib/key-rep-area/keyRepArea";
  import KeyRepAreas from "$legacy-pages-lib/key-rep-area/KeyRepAreas.svelte";
  import RepCounter from "$legacy-pages-lib/count-reps/RepCounter.svelte";

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

  const keyRepAreasForEachLimb = {
    right_wrist: {
      keyRepAreas: [
        new KeyRepArea(
          "right_elbow",
          { x: 20, y: -40 },
          { width: 80, height: 80 }
        ),
        new KeyRepArea(
          "right_shoulder",
          { x: -20, y: -40 },
          { width: 80, height: 80 }
        ),
        new KeyRepArea(
          "right_elbow",
          { x: 20, y: -40 },
          { width: 80, height: 80 }
        ),
      ],
    },
    left_wrist: {
      keyRepAreas: [
        new KeyRepArea(
          "left_elbow",
          { x: 20, y: -40 },
          { width: 80, height: 80 }
        ),
        new KeyRepArea(
          "left_shoulder",
          { x: -20, y: -40 },
          { width: 80, height: 80 }
        ),
        new KeyRepArea(
          "left_elbow",
          { x: 20, y: -40 },
          { width: 80, height: 80 }
        ),
      ],
    },
  };

  let pauseDelay = 5;
</script>

<div class="container">
  <!-- svelte-ignore a11y-media-has-caption -->

  <div style="position: relative;">
    <video src="" bind:this={$videoEl} />
    <RepCounter focusLimbs={keyRepAreasForEachLimb} />
    <KeypointsOverlay keypoints={$relativeToKeypoints} />
    <KeypointsOverlay keypoints={$focusLimbKeypoints} />

    <!-- the divider so mouse events can interact with 👇 but not ☝️ -->
    <div class="divider" />

    {#each Object.entries(keyRepAreasForEachLimb) as [focusLimb, { keyRepAreas }] (keyRepAreas)}
      <KeyRepAreas
        {keyRepAreas}
        keypoints={$controlledKeypoints}
        focusKeypointName={focusLimb}
        updateKeyRepAreas={() => {}}
      />
    {/each}
  </div>

  <!-- controlling pause/play ⏯️ -->
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
