<script lang="ts">
  import { page } from "$app/stores";
  import exercises, {
    selectedExerciseId,
    selectedExercise,
  } from "$legacy-pages-lib/exercises/store";

  import InputVideoFile from "$legacy-pages-lib/video/InputVideoFile.svelte";
  import VideoFromFile from "$legacy-pages-lib/video/VideoFromFile.svelte";
  import LiveVideo from "$legacy-pages-lib/video/LiveVideo.svelte";
  import PauseControls from "$legacy-pages-lib/paused/PauseControls.svelte";

  import { onDestroy } from "svelte";
  import { scale } from "$legacy-pages-lib/pose-detection/scaleKeypoints";
  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$legacy-pages-lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$legacy-pages-lib/pose-detection/KeypointsOverlay.svelte";

  import KeyRepAreas from "$legacy-pages-lib/key-rep-area/KeyRepAreas.svelte";
  import EditingExercisePanel from "$legacy-pages-lib/exercises/EditingExercisePanel.svelte";

  import RepCounter from "$legacy-pages-lib/count-reps/RepCounter.svelte";

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

<label>
  Use camera?
  <input type="checkbox" name="live video as source" bind:checked={live} />
</label>

{#if !live}
  <InputVideoFile updateVideoFile={(updated) => (validVideoFile = updated)} />
{/if}

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
