<script>
  import { browser } from "$app/environment";
  import { videoEl, keypoints } from "$lib/pose-detection/keypoints.js";
  import keypointNames from "$lib/pose-detection/keypointNames.json";

  import Keypoint from "$lib/common-shapes/Keypoint.svelte";
  import SelectOneKeypoint from "$lib/inputs/SelectOneKeypoint.svelte";
  import KeyRepArea from "$lib/check-rep/KeyRepArea.svelte";

  let stream = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  $: if (stream) {
    $videoEl.srcObject = stream;
    $videoEl.play();
  }

  // $: videoEl.set(cameraLiveFeedVideoEl);

  let keyRepAreas = [
    { relativeTo: "right_ear", focus: "right_wrist" },
    { relativeTo: "left_ear", focus: "right_wrist" },
  ];
</script>

<div class="container">
  <div class="inputs">
    {#each keyRepAreas as keyRepArea, index (keyRepArea)}
      <div style="display:flex; margin-bottom: 50px;">
        <p>Key area relative to?</p>
        <SelectOneKeypoint
          {keypointNames}
          bind:selectedKeypoint={keyRepAreas[index].relativeTo}
        />

        <p>Where is the focus?</p>
        <SelectOneKeypoint
          {keypointNames}
          bind:selectedKeypoint={keyRepAreas[index].focus}
        />
      </div>
    {/each}
  </div>

  <!-- svelte-ignore a11y-media-has-caption -->

  <div style="position: relative;">
    <video src="" bind:this={$videoEl} />

    {#each keyRepAreas as keyRepArea, index (keyRepArea)}
      <KeyRepArea
        relativeToWhichKeypoint={keyRepArea.relativeTo}
        keypoints={$keypoints}
        focusKeypoint={keyRepArea.focus}
      />
    {/each}

    <div id="diagram" style="position:absolute;">
      {#if $keypoints}
        {#each $keypoints as keypoint (keypoint)}
          {#if keyRepAreas
            .map((keyRepArea) => keyRepArea.relativeTo)
            .includes(keypoint.name) || keyRepAreas
              .map((keyRepArea) => keyRepArea.focus)
              .includes(keypoint.name)}
            <Keypoint {keypoint} />
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-start;
    justify-content: left;
  }

  #diagram {
    top: 0;
    left: 0;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    overflow-y: auto;
  }
</style>
