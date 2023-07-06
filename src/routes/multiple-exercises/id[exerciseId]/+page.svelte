<script lang="ts">
  import { page } from "$app/stores";
  import { onDestroy } from "svelte";
  import exercises, {
    selectedExerciseId,
    selectedExercise,
  } from "$lib/exercises/store";

  import InputVideoFile from "$lib/video/InputVideoFile.svelte";
  import type { Readable } from "svelte/store";
  import PauseControls from "$lib/paused/PauseControls.svelte";

  import { scale } from "$lib/pose-detection/scaleKeypoints.js";
  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$lib/pose-detection/KeypointsOverlay.svelte";

  import KeyRepAreas from "$lib/key-rep-area/KeyRepAreas.svelte";
  import EditingExercisePanel from "$lib/exercises/EditingExercisePanel.svelte";

  import RepCounter from "$lib/count-reps/RepCounter.svelte";
  import VideoFromFile from "$lib/video/VideoFromFile.svelte";
  import LiveVideo from "$lib/video/LiveVideo.svelte";

  selectedExerciseId.select($page.params.exerciseId);

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

<p>{JSON.stringify($selectedExercise)}</p>
{#if !live}
  <InputVideoFile
    updateVideoFile={(newValidVideoFile) =>
      (validVideoFile = newValidVideoFile)}
  />
{/if}
<input type="checkbox" name="live video as source" bind:checked={live} />

{#if $selectedExercise && (live || validVideoFile)}
  <div class="container" style="--height: {clientHeight}px;">
    <div class="videoNrep-counter-container" bind:clientHeight bind:clientWidth>
      {#if live}
        <LiveVideo bind:videoWidth bind:videoHeight />
      {:else}
        <VideoFromFile bind:videoWidth bind:videoHeight {validVideoFile} />
      {/if}

      <RepCounter focusLimbs={$selectedExercise.focusLimbs} />

      <!-- Relative for KRA's & Focus limb keypoints -->
      <KeypointsOverlay keypoints={$relativeToKeypoints} colourTheme="gray" />
      <KeypointsOverlay keypoints={$focusLimbKeypoints} colourTheme="gold" />

      <!-- the divider so mouse events can interact with 👇 but not ☝️ -->
      <div class="divider" />

      {#each Object.entries($selectedExercise.focusLimbs) as [focusLimb, { keyRepAreas }] (focusLimb)}
        <KeyRepAreas
          {keyRepAreas}
          updateKeyRepAreas={(updated) =>
            ($exercises[$selectedExerciseId].focusLimbs[focusLimb].keyRepAreas =
              updated)}
          keypoints={$controlledKeypoints}
          focusKeypointName={focusLimb}
        />
      {/each}

      <div style="position:absolute; bottom:0; left:0;">
        <PauseControls />
      </div>
    </div>

    <EditingExercisePanel
      exercise={$selectedExercise}
      updateExercise={(updated) => ($exercises[$selectedExerciseId] = updated)}
      exerciseId={$selectedExerciseId}
    />
  </div>
{/if}

<style>
  .videoNrep-counter-container {
    position: relative;
    margin-right: 20px;
  }

  .container {
    display: flex;
    align-items: flex-start;
    height: var(--height);
  }
</style>
