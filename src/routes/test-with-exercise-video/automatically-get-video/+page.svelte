<script>
  import { videoEl as exerciseVideoEl } from "$lib/video/getUserVideo.js";
  import PauseControls from "$lib/paused/PauseControls.svelte";
  import { scale } from "$lib/pose-detection/scaleKeypoints.js";
  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$lib/pose-detection/otherKeypointStores.js";
  import KeypointsOverlay from "$lib/pose-detection/KeypointsOverlay.svelte";

  import exercise from "$lib/exercises/store";
  import KeyRepAreas from "$lib/key-rep-area/KeyRepAreas.svelte";
  import EditingKeyRepAreasPanel from "$lib/key-rep-area/EditingKeyRepAreasPanel.svelte";

  import RepCounter from "$lib/count-reps/RepCounter.svelte";
  import { onDestroy } from "svelte";

  let clientWidth, clientHeight, videoWidth, videoHeight;
  $: if (clientWidth && clientHeight && videoWidth && videoHeight) {
    scale.set({
      horizontal: clientWidth / videoWidth,
      vertical: clientHeight / videoHeight,
    });
  }

  onDestroy(() => {
    scale.set({
      horizontal: 1,
      vertical: 1,
    });
  });
</script>

{#if $exercise} <p>{$exercise.exerciseName}</p> {/if}

<div class="container">
  <div class="videoNrep-counter-container" bind:clientHeight bind:clientWidth>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      bind:this={$exerciseVideoEl}
      bind:videoWidth
      bind:videoHeight
      alt="the uploaded video file🤞"
      src="/testing/bicep-curls-9-reps.mp4"
      loop
      muted
      autoplay
    />
    {#if $exercise}
      <RepCounter
        keyRepAreas={$exercise.exerciseKeyRepAreas}
        exerciseName={$exercise.exerciseName}
      />

      <!-- Relative for KRA's & Focus limb keypoints -->
      <KeypointsOverlay keypoints={$relativeToKeypoints} colourTheme="gray" />
      <KeypointsOverlay keypoints={$focusLimbKeypoints} colourTheme="gold" />

      <!-- the divider so mouse events can interact with 👇 but not ☝️ -->
      <div class="divider" />

      {#each Object.entries($exercise.exerciseKeyRepAreas) as [focusLimb, _] (focusLimb)}
        <KeyRepAreas
          bind:keyRepAreas={$exercise.exerciseKeyRepAreas[focusLimb]
            .keyRepAreas}
          bind:startKeyRepAreaIsEnd={$exercise.exerciseKeyRepAreas[focusLimb]
            .startKeyRepAreaIsEnd}
          keypoints={$controlledKeypoints}
          focusKeypoint={focusLimb}
        />
      {/each}
    {/if}

    <div style="position:absolute; bottom:0; left:0;">
      <PauseControls />
    </div>
  </div>

  <EditingKeyRepAreasPanel />
</div>

<style>
  .videoNrep-counter-container {
    position: relative;
  }

  .container {
    display: flex;
  }

  video {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
