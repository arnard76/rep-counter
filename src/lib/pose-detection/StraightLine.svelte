<script>
  export let point1, point2;
  export let horizontal = true;
  export let colour = "red";

  $: ({ x: x1, y: y1 } = point1);
  $: ({ x: x2, y: y2 } = point2);
</script>

<div
  style="--x1: {x1}px; --y1: {y1}px; --x2: {x2}px; --y2: {y2}px; --colour: {colour
    ? colour
    : 'red'}"
  class={horizontal ? "horizontal" : "vertical"}
/>

<style>
  div {
    width: calc(var(--x2) - var(--x1));
    height: 2px;

    position: absolute;
    top: 0;
    left: 0;

    transform: translate(var(--x1), var(--y1));

    background-color: var(--colour);
  }

  .vertical {
    height: calc(var(--y2) - var(--y1));
    width: 2px;
  }
</style>
