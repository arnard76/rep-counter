<script>
  export let keypoint;

  export let draggable = false;
  export let colour = null;

  $: verifiedColour = colour || "rgba(255, 0, 25, 0.7)";
</script>

<div
  on:drag|stopPropagation|capture
  on:dragend|stopPropagation|capture
  class="keypoint"
  style={`--x: ${keypoint.x}px; --y: ${
    keypoint.y
  }px; --colour: ${verifiedColour};
  ${draggable ? "cursor: nw-resize;" : ""}`}
/>

<style>
  .keypoint {
    --x: 0;
    --y: 0;
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: var(--colour);
    border-radius: 30%;
    transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%));
  }
</style>
