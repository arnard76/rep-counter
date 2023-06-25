<script>
  import UserVideo from "$lib/video/UserVideo.svelte";
  import PauseControls from "$lib/paused/PauseControls.svelte";

  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$lib/pose-detection/KeypointsOverlay.svelte";

  import exercise from "$lib/exercises/store";
  import KeyRepAreas from "$lib/key-rep-area/KeyRepAreas.svelte";
  import EditingKeyRepAreasPanel from "$lib/key-rep-area/EditingKeyRepAreasPanel.svelte";

  import RepCounter from "$lib/count-reps/RepCounter.svelte";
</script>

{#if $exercise} <p>{$exercise.exerciseName}</p> {/if}

<div class="container">
  <div class="videoNrep-counter-container">
    <UserVideo />

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

      {#each Object.entries($exercise.exerciseKeyRepAreas) as [focusLimb] (focusLimb)}
        <KeyRepAreas
          bind:keyRepAreas={$exercise.exerciseKeyRepAreas[focusLimb]
            .keyRepAreas}
          bind:startKeyRepAreaIsEnd={$exercise.exerciseKeyRepAreas[focusLimb]
            .startKeyRepAreaIsEnd}
          keypoints={$controlledKeypoints}
          focusKeypointName={focusLimb}
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
</style>
