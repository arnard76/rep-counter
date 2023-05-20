<script>
  import Keypoint from "$lib/common-shapes/Keypoint.svelte";
  import Line from "$lib/common-shapes/StraightLine.svelte";

  export let keyRepArea;
  export let keypoints;
  export let focusKeypoint = null;

  let corners, inArea;
  const origin = { x: 0, y: 0 };

  $: if (keyRepArea && keypoints) {
    corners = keyRepArea.calcAreaCorners(keypoints);
    inArea = focusKeypoint
      ? keyRepArea.pointInArea(keypoints, focusKeypoint)
      : false;
  }

  $: colour = inArea ? "green" : "lightgrey";

  function moveTopLeft(e) {
    keyRepArea.topLeft.x = keyRepArea.topLeft.x + e.offsetX;
    keyRepArea.topLeft.y = keyRepArea.topLeft.y + e.offsetY;
  }

  function adjustSize(e) {
    keyRepArea.areaSize.width = keyRepArea.areaSize.width - e.offsetX;
    keyRepArea.areaSize.height = keyRepArea.areaSize.height - e.offsetY;
  }
</script>

{#if corners}
  <div
    class="area"
    style="--width: {keyRepArea.areaSize.width}px; --height: {keyRepArea
      .areaSize.height}px; --topLeftCornerX: {corners.topLeft
      .x}px; --topLeftCornerY: {corners.topLeft.y}px;"
  >
    <Keypoint
      keypoint={origin}
      colour="blue"
      on:drag={(e) => {
        moveTopLeft(e);
        adjustSize(e);
      }}
      on:dragend={(e) => {
        moveTopLeft(e);
        adjustSize(e);
      }}
      draggable
    />
    <Line
      point1={origin}
      point2={{ ...origin, x: keyRepArea.areaSize.width }}
      {colour}
    />
    <Keypoint keypoint={{ ...origin, x: keyRepArea.areaSize.width }} {colour} />
    <Line
      point1={origin}
      point2={{ ...origin, y: keyRepArea.areaSize.height }}
      horizontal={false}
      {colour}
    />
    <Keypoint
      keypoint={{ ...origin, y: keyRepArea.areaSize.height }}
      {colour}
    />
    <Line
      point1={{ ...origin, y: keyRepArea.areaSize.height }}
      point2={{ x: keyRepArea.areaSize.width, y: keyRepArea.areaSize.height }}
      {colour}
    />
    <Keypoint
      {colour}
      keypoint={{ x: keyRepArea.areaSize.width, y: keyRepArea.areaSize.height }}
    />
    <Line
      point1={{ ...origin, x: keyRepArea.areaSize.width }}
      point2={{ x: keyRepArea.areaSize.width, y: keyRepArea.areaSize.height }}
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
    width: var(--width);
    height: var(--height);
    transform: translate(var(--topLeftCornerX), var(--topLeftCornerY));
  }
</style>
