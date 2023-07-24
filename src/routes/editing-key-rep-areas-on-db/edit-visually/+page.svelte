<script>
  import { onDestroy } from "svelte";
  import { scale } from "$legacy-pages-lib/pose-detection/scaleKeypoints";
  import UserVideo from "$legacy-pages-lib/video/LiveVideo.svelte";
  import PauseControls from "$legacy-pages-lib/paused/PauseControls.svelte";

  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$legacy-pages-lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$legacy-pages-lib/pose-detection/KeypointsOverlay.svelte";

  import exercises, {
    selectedExercise,
    selectedExerciseId,
  } from "$legacy-pages-lib/exercises/store";
  import KeyRepAreas from "$legacy-pages-lib/key-rep-area/KeyRepAreas.svelte";
  import EditingExercisePanel from "$legacy-pages-lib/exercises/EditingExercisePanel.svelte";

  import RepCounter from "$legacy-pages-lib/count-reps/RepCounter.svelte";

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

  selectedExerciseId.select("0");
</script>

{#if $selectedExercise}
  <p>{$selectedExercise.name}</p>

  <div class="container">
    <div class="videoNrep-counter-container" bind:clientHeight bind:clientWidth>
      <UserVideo bind:videoWidth bind:videoHeight />

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
    height: 100%;
  }

  .container {
    display: flex;
  }
</style>
