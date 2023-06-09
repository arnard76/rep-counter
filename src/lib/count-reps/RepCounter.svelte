<script>
  import keypoints from "$lib/pose-detection/keypoints.js";
  import RepCounter from "$lib/count-reps/repCounter.js";
  import { onDestroy } from "svelte";

  export let exerciseName, keyRepAreas;

  let theRepCounter = new RepCounter(exerciseName, keyRepAreas);

  let keepCountingReps = setInterval(() => {
    let repCounterUpdated = theRepCounter.updateRepProgress($keypoints);
    if (!repCounterUpdated) return;

    theRepCounter = theRepCounter;
  }, 500);

  onDestroy(() => {
    clearInterval(keepCountingReps);
  });
</script>

<div
  style="position:absolute;top: 0;left:0; background-color: rgba(0,0,0,.8); color:white; padding:5px;"
>
  <p>
    count: {theRepCounter.numberOfReps}
  </p>

  {#each theRepCounter.limbRepCounters as limbRepCounter (limbRepCounter.focusLimbName)}
    <p style="margin-left: 20px; font-size: 10px;">
      focus limb: {limbRepCounter.focusLimbName}, last index: {limbRepCounter.lastKeyAreaIndex},
      limb count: {limbRepCounter.numberOfReps}
    </p>
  {/each}
</div>
