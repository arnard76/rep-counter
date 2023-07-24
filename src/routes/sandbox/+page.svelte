<script lang="ts">
  import exercises, {
    selectedExerciseId,
    selectedExercise,
  } from "$lib/exercises/store";

  import InputVideoFile from "$lib/video/InputVideoFile.svelte";
  import VideoFromFile from "$lib/video/VideoFromFile.svelte";

  import { onDestroy } from "svelte";
  import { scale } from "$lib/pose-detection/scaleKeypoints";
  import RepCounter from "$lib/count-reps/RepCounter.svelte";
  import ExerciseSelector from "$lib/exercises/ExerciseSelector.svelte";
  import KeyRepAreas from "$lib/key-rep-area/KeyRepAreas.svelte";
  import PauseControls from "$lib/paused/PauseControls.svelte";

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

  let validVideoFile: File | null;

  $: console.log({
    videoWidth,
    videoHeight,
    clientWidth,
    clientHeight,
    $scale,
  });
</script>

<ExerciseSelector />

<InputVideoFile updateVideoFile={(updated) => (validVideoFile = updated)} />

{#if $selectedExercise && validVideoFile}
  <div class="container" style="--height: {clientHeight || 150}px;">
    <div class="video-container" bind:clientHeight bind:clientWidth>
      <VideoFromFile bind:videoWidth bind:videoHeight {validVideoFile} />

      <RepCounter focusLimbs={$selectedExercise.focusLimbs} />

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
</style>
