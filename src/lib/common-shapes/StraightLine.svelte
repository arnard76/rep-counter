<script>
  export let point1, point2;

  $: ({ x: x1, y: y1 } = point1);
  $: ({ x: x2, y: y2 } = point2);
</script>

{#if x1 && y1 && x2 && y2}
  <div style="--x1: {x1}px; --y1: {y1}px; --x2: {x2}px; --y2: {y2}px;" />
{/if}

<style>
  div {
    background-color: red;
    width: calc(var(--x2) - var(--x1));
    height: 2px;
    /* width: max(calc(var(--x2) - var(--x1), calc(-1 * (var(--x2) - var(--x1))))); */
    /* height: max(
      calc(var(--y2) - var(--y1), calc(-1 * (var(--y2) - var(--y1))))
    ); */

    position: absolute;
    top: 0;
    left: 0;
    transform: translate(var(--x1), var(--y1));
  }
</style>
