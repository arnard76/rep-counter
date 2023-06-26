<script>
  import { videoEl as exerciseVideoEl } from "$lib/video/getUserVideo.js";
  import PauseControls from "$lib/paused/PauseControls.svelte";

  import { scale } from "$lib/pose-detection/scaleKeypoints.js";
  import { onDestroy } from "svelte";

  import {
    controlledKeypoints,
    focusLimbKeypoints,
    relativeToKeypoints,
  } from "$lib/pose-detection/otherKeypointStores";
  import KeypointsOverlay from "$lib/pose-detection/KeypointsOverlay.svelte";

  import exercise from "$lib/exercises/store";
  import KeyRepAreas from "$lib/key-rep-area/KeyRepAreas.svelte";
  import EditingExercisePanel from "$lib/exercises/EditingExercisePanel.svelte";

  import RepCounter from "$lib/count-reps/RepCounter.svelte";

  // setting scale for keypoints
  // so that they align with video size on screen (instead of video resolution)
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

  // grabbing the video file via html input
  let inputtedVideoFiles;
  let haveAVideoFile = false;
  const acceptedVideoFileExtensions = ["mp4", "mpeg", "avi"];

  $: console.log("input", inputtedVideoFiles);
  $: console.log("verified exercise video", $exerciseVideoEl);

  $: if (inputtedVideoFiles?.length) {
    let filename = inputtedVideoFiles[0].name.split(".");
    if (acceptedVideoFileExtensions.includes(filename[filename.length - 1])) {
      haveAVideoFile = true;
    }
  }

  $: if ($exerciseVideoEl && haveAVideoFile) {
    $exerciseVideoEl.src = URL.createObjectURL(inputtedVideoFiles[0]); // set src to blob url
    console.log("setting src of video :)");
    $exerciseVideoEl.play();
  }
</script>

<div class="container">
  <input
    type="file"
    name=""
    id=""
    accept="*.mp4,*.mpeg,*.avi"
    bind:files={inputtedVideoFiles}
  />

  {#if haveAVideoFile}
    {#if $exercise} <p>{$exercise.exerciseName}</p> {/if}

    <div style="display: flex;">
      <div class="video-border">
        <div
          class="videoNrep-counter-container"
          bind:clientHeight
          bind:clientWidth
        >
          <!-- svelte-ignore a11y-media-has-caption -->
          <video
            bind:this={$exerciseVideoEl}
            bind:videoWidth
            bind:videoHeight
            alt="the uploaded video file🤞"
            loop
            muted
            autoplay
          />
          {#if $exercise}
            <RepCounter focusLimbs={$selectedExercise.focusLimbs} />

            <!-- Relative for KRA's & Focus limb keypoints -->
            <KeypointsOverlay
              keypoints={$relativeToKeypoints}
              colourTheme="gray"
            />
            <KeypointsOverlay
              keypoints={$focusLimbKeypoints}
              colourTheme="gold"
            />

            <!-- the divider so mouse events can interact with 👇 but not ☝️ -->
            <div class="divider" />

            {#each Object.entries($exercise.exerciseKeyRepAreas) as [focusLimb, _] (focusLimb)}
              <KeyRepAreas
                bind:keyRepAreas={$exercise.exerciseKeyRepAreas[focusLimb]
                  .keyRepAreas}
                bind:startKeyRepAreaIsEnd={$exercise.exerciseKeyRepAreas[
                  focusLimb
                ].startKeyRepAreaIsEnd}
                keypoints={$controlledKeypoints}
                focusKeypointName={focusLimb}
              />
            {/each}
          {/if}

          <div style="position:absolute; bottom:0; left:0;">
            <PauseControls />
          </div>
        </div>
      </div>

      <EditingExercisePanel />
    </div>
  {/if}
</div>

<style>
  .videoNrep-counter-container {
    position: relative;
  }

  .video-border {
    margin-top: 20px;
    padding: 20px;
    max-width: 95%;
    background: linear-gradient(90deg, rgb(0, 255, 17), rgb(8, 127, 225));
  }

  video {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
