<script lang="ts">
  import exercises, {
    selectedExerciseId,
    selectedExercise,
  } from "$lib/exercises/store";
  import {
    createExercise,
    duplicateExercise,
    deleteExercise,
  } from "$lib/exercises/CRUD/crudDB";

  import InputVideoFile from "$lib/video/InputVideoFile.svelte";
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
  import EditingExercisePanel from "$lib/exercises/EditingExercisePanel.svelte";

  import RepCounter from "$lib/count-reps/RepCounter.svelte";
  import ExerciseSelector from "$lib/exercises/ExerciseSelector.svelte";
  import debug from "$lib/testing/debugger";
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

  const defaultExerciseFormat = {
    name: "untitled",
    focusLimbs: {},
  };
</script>

<ExerciseSelector />

<button on:click={() => createExercise({ ...defaultExerciseFormat })}
  >➕ exercise</button
>
<button on:click={() => duplicateExercise($selectedExercise)}
  >duplicate this exercise</button
>
<button on:click={() => deleteExercise($selectedExerciseId)}>🗑️</button>
<p>{JSON.stringify($selectedExercise)}</p>
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

    <EditingExercisePanel
      exercise={$selectedExercise}
      updateExercise={(updated) => ($exercises[$selectedExerciseId] = updated)}
      exerciseId={$selectedExerciseId}
    />
  </div>
{/if}
{#if !$debug}
  <button on:click={() => ($debug = true)}>debug?</button>
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
