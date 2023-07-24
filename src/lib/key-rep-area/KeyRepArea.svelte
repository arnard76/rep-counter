<script lang="ts">
  import Keypoint from "$lib/pose-detection/Keypoint.svelte";
  import Line from "$lib/pose-detection/StraightLine.svelte";
  import selectedKeyRepArea from "$lib/key-rep-area/selected";
  import type KeyRepArea from "./keyRepArea";
  import { controlledKeypoints } from "$lib/pose-detection/otherKeypointStores";
  import { scale } from "$lib/pose-detection/scaleKeypoints";
  import type { FormattedCorners } from ".";

  export let keyRepArea: KeyRepArea;
  export let focusKeypoint = null;
  export let updateKeyRepArea: (updated: KeyRepArea) => void;

  let corners: FormattedCorners, inArea: boolean;
  const relTopLeft = { x: 0, y: 0 };

  $: if (keyRepArea && $controlledKeypoints) {
    corners = keyRepArea.calcScaledAreaCorners($controlledKeypoints, $scale);
    inArea =
      focusKeypoint &&
      keyRepArea.pointInArea($controlledKeypoints, focusKeypoint);
  }

  $: colour = inArea ? "green" : "lightgrey";

  function moveTopLeft(e: MouseEvent) {
    keyRepArea.setTopLeftFromMouseDrag(e);
    updateKeyRepArea(keyRepArea);
  }

  function adjustSize(e: MouseEvent) {
    keyRepArea.setTopLeftFromMouseDrag(e);
    keyRepArea.setAreaSizeFromMouseDrag(e);
    updateKeyRepArea(keyRepArea);
  }
</script>

{#if corners}
  <div
    class="area"
    style="width: {keyRepArea.areaSize.width * $scale.horizontal}px;
      height: {keyRepArea.areaSize.height * $scale.vertical}px;
      transform: translate({corners.absTopLeft.x}px, {corners.absTopLeft.y}px);"
    class:selected={$selectedKeyRepArea === keyRepArea}
    on:drag={moveTopLeft}
    on:dragend={moveTopLeft}
    on:dblclick={(e) => selectedKeyRepArea.select(keyRepArea)}
  >
    <!-- lines -->
    <Line point1={relTopLeft} point2={corners.relTopRight} {colour} />

    <Line
      point1={relTopLeft}
      point2={corners.relBottomLeft}
      horizontal={false}
      {colour}
    />

    <Line
      point1={corners.relBottomLeft}
      point2={corners.relBottomRight}
      {colour}
    />

    <Line
      point1={corners.relTopRight}
      point2={corners.relBottomRight}
      horizontal={false}
      {colour}
    />

    <!-- keypoints -->
    <Keypoint keypoint={corners.relTopRight} {colour} />

    <Keypoint keypoint={corners.relBottomLeft} {colour} />

    <Keypoint keypoint={corners.relBottomRight} {colour} />

    <Keypoint
      keypoint={relTopLeft}
      colour="blue"
      on:drag={adjustSize}
      on:dragend={adjustSize}
      draggable
    />
  </div>
{/if}

<style>
  .area {
    position: absolute;
    top: 0;
    left: 0;

    cursor: move;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .area.selected {
    background-color: rgba(25, 60, 150, 0.3);
  }
</style>
