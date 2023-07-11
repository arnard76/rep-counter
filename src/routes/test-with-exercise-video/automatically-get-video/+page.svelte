<script>
  import exerciseVideoEl from "$legacy-pages-lib/video/video";
  import PauseControls from "$legacy-pages-lib/paused/PauseControls.svelte";
  import { scale } from "$legacy-pages-lib/pose-detection/scaleKeypoints";
  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$legacy-pages-lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$legacy-pages-lib/pose-detection/KeypointsOverlay.svelte";

  import exercises, {
    selectedExerciseId,
    selectedExercise,
  } from "$legacy-pages-lib/exercises/store";
  import KeyRepAreas from "$legacy-pages-lib/key-rep-area/KeyRepAreas.svelte";
  import EditingExercisePanel from "$legacy-pages-lib/exercises/EditingExercisePanel.svelte";

  import RepCounter from "$legacy-pages-lib/count-reps/RepCounter.svelte";
  import { onDestroy } from "svelte";

  selectedExerciseId.select("0");

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

      {#each Object.entries($selectedExercise.focusLimbs) as [focusLimb, { keyRepAreas, startKeyRepAreaIsEnd }] (focusLimb)}
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
