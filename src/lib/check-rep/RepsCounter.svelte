<script>
  import { keypoints } from "$lib/pose-detection/keypoints.js";
  import { RepsCounter } from "$lib/check-rep/repsCounter.js";

  import { onDestroy } from "svelte";

  export let keyRepAreas = null;
  export let focusKeypoint = null;

  let lastIndex, repCount;

  let repCounter = new RepsCounter(keyRepAreas);

  let keepCountingReps = setInterval(() => {
    repCounter.isLimbInNextKeyArea($keypoints, focusKeypoint);
    repCount = repCounter.numberOfReps;
    lastIndex = repCounter.lastKeyAreaIndex;
  }, 500);

  onDestroy(() => {
    clearInterval(keepCountingReps);
  });
</script>

<p style="position:absolute;top: 0;left:0">
  last index: {lastIndex}, count: {repCount}
</p>
