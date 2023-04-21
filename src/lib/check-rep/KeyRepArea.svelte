<script>
  import { Area } from "$lib/check-rep/defineKeyRepArea.js";
  import Keypoint from "$lib/common-shapes/Keypoint.svelte";
  import Line from "$lib/common-shapes/StraightLine.svelte";

  export let topLeft = { x: 10, y: 20 },
    areaSize = { width: 50, height: 50 },
    relativeToWhichKeypoint = "nose";

  export let keypoints;
  export let focusKeypoint = null;

  const keyArea = new Area(relativeToWhichKeypoint, topLeft, areaSize);

  $: if (relativeToWhichKeypoint) {
    keyArea.relativeToWhichKeypoint = relativeToWhichKeypoint;
  }

  let corners, inArea;
  $: if (keypoints) {
    corners = keyArea.calcAreaCorners(keypoints);
    inArea = focusKeypoint
      ? keyArea.pointInArea(keypoints, focusKeypoint)
      : false;
  }

  $: colour = inArea ? "green" : "lightgrey";
</script>

{#if corners}
  <div class="area">
    <Keypoint keypoint={corners.topLeft} {colour} />
    <Line point1={corners.topLeft} point2={corners.topRight} {colour} />
    <Keypoint keypoint={corners.topRight} {colour} />
    <Line
      point1={corners.topLeft}
      point2={corners.bottomLeft}
      horizontal={false}
      {colour}
    />
    <Keypoint keypoint={corners.bottomLeft} {colour} />
    <Line point1={corners.bottomLeft} point2={corners.bottomRight} {colour} />
    <Keypoint keypoint={corners.bottomRight} {colour} />
    <Line
      point1={corners.topRight}
      point2={corners.bottomRight}
      horizontal={false}
      {colour}
    />
  </div>
{/if}

<style>
  .area {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
