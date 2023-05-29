<script>
  import { keypoints } from "$lib/pose-detection/keypoints.js";
  import {
    LimbRepCounter,
    canNotStartNextRep,
  } from "$lib/check-rep/limbRepCounter.js";

  import { onDestroy } from "svelte";

  export let keyRepAreas = null;
  export let focusKeypoint = null;

  let repCounter = new LimbRepCounter(focusKeypoint, keyRepAreas);
  $: repCounter.focusLimbName = focusKeypoint;

  let keepCountingReps = setInterval(() => {
    let repUpdated = repCounter.updateRepProgress($keypoints);
    if (!repUpdated) return;

    repCounter.lastKeyAreaIndex == canNotStartNextRep &&
      repCounter.getReadyForNextRep();
    repCounter = repCounter;
  }, 500);

  onDestroy(() => {
    clearInterval(keepCountingReps);
  });
</script>

<p style="position:absolute;top: 0;left:0">
  last index: {repCounter.lastKeyAreaIndex}, count: {repCounter.numberOfReps}
</p>
