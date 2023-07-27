<script lang="ts">
  import Header from "$lib/site-nav/Header.svelte";

  import exercises, {
    selectedExerciseId,
    selectedExercise,
  } from "$lib/exercises/store";

  import VideoFromFile from "$lib/video/VideoFromFile.svelte";
  import LiveVideo from "$lib/video/LiveVideo.svelte";
  import PauseControls from "$lib/paused/PauseControls.svelte";

  import { onDestroy } from "svelte";
  import { scale } from "$lib/pose-detection/scaleKeypoints";
  import {
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$lib/pose-detection/KeypointsOverlay.svelte";

  import KeyRepAreas from "$lib/key-rep-area/KeyRepAreas.svelte";

  import RepCounter from "$lib/count-reps/RepCounter.svelte";
  import ExerciseSelector from "$lib/exercises/ExerciseSelector.svelte";
  import VideoSourceToggle from "$lib/video/VideoSourceToggle.svelte";

  let clientWidth: number,
    clientHeight: number,
    videoWidth: number,
    videoHeight: number;
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

  let live: boolean = false;
  let validVideoFile: File | null;
</script>

<svelte:head>
  <title>rep-counter</title>
</svelte:head>

<Header />
<ExerciseSelector />
<hr />
<VideoSourceToggle bind:live bind:validVideoFile />
<hr />

{#if $selectedExercise && (live || validVideoFile)}
  <div class="container" style="--height: {clientHeight || 150}px;">
    <div class="video-container" bind:clientHeight bind:clientWidth>
      {#if live}
        <LiveVideo bind:videoWidth bind:videoHeight />
      {:else}
        <VideoFromFile bind:videoWidth bind:videoHeight {validVideoFile} />
      {/if}

      <RepCounter focusLimbs={$selectedExercise.focusLimbs} />

      <!-- Relative for KRA's & Focus limb keypoints -->
      <KeypointsOverlay keypoints={$relativeToKeypoints} colourTheme="gray" />
      <KeypointsOverlay keypoints={$focusLimbKeypoints} colourTheme="gold" />

      <!-- so mouse events can interact with 👇 but not ☝️ -->
      <div class="divider" />

      {#each Object.entries($selectedExercise.focusLimbs) as [focusLimb, { keyRepAreas }] (focusLimb)}
        <KeyRepAreas
          {keyRepAreas}
          updateKeyRepAreas={(updated) =>
            ($exercises[$selectedExerciseId].focusLimbs[focusLimb].keyRepAreas =
              updated)}
          focusKeypointName={focusLimb}
        />
      {/each}

      <div style="position:absolute; bottom:0; left:0;">
        <PauseControls />
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    display: flex;
    align-items: flex-start;
    height: var(--height);
    gap: 20px;
  }

  .video-container {
    position: relative;
  }

  .divider {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
  }
</style>
