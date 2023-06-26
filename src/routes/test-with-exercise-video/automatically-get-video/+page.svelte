<script>
  import { videoEl as exerciseVideoEl } from "$lib/video/getUserVideo.js";
  import PauseControls from "$lib/paused/PauseControls.svelte";
  import { scale } from "$lib/pose-detection/scaleKeypoints.js";
  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$lib/pose-detection/KeypointsOverlay.svelte";

  import exercises, {
    selectedExerciseId,
    selectedExercise,
  } from "$lib/exercises/store";
  import KeyRepAreas from "$lib/key-rep-area/KeyRepAreas.svelte";
  import EditingExercisePanel from "$lib/exercises/EditingExercisePanel.svelte";

  import RepCounter from "$lib/count-reps/RepCounter.svelte";
  import { onDestroy } from "svelte";

  selectedExerciseId.select($exercises?.length ? $exercises[0].id : "0");

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

{#if $selectedExercise}
  <p>{$selectedExercise.name}</p>

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
      <RepCounter focusLimbs={$selectedExercise.focusLimbs} />

      <!-- Relative for KRA's & Focus limb keypoints -->
      <KeypointsOverlay keypoints={$relativeToKeypoints} colourTheme="gray" />
      <KeypointsOverlay keypoints={$focusLimbKeypoints} colourTheme="gold" />
      <!-- the divider so mouse events can interact with 👇 but not ☝️ -->
      <div class="divider" />

      {#each Object.entries($selectedExercise.focusLimbs) as [focusLimb] (focusLimb)}
        <KeyRepAreas
          bind:keyRepAreas={$exercises[
            exercises.getIndexOfExercise($selectedExerciseId)
          ].focusLimbs[focusLimb].keyRepAreas}
          startKeyRepAreaIsEnd
          keypoints={$controlledKeypoints}
          focusKeypointName={focusLimb}
        />
      {/each}

      <div style="position:absolute; bottom:0; left:0;">
        <PauseControls />
      </div>
    </div>

    <EditingExercisePanel
      bind:exercise={$exercises[
        exercises.getIndexOfExercise($selectedExerciseId)
      ]}
    />
  </div>
{/if}

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
