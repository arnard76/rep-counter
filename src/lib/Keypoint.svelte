<script>
  export let keypoint;
</script>

{#if keypoint.x && keypoint.y}
  <div class="keypoint" style={`--x: ${keypoint.x}px; --y: ${keypoint.y}px;`} />
{/if}

<style>
  .keypoint {
    --x: 0;
    --y: 0;
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 0, 25, 0.7);
    border-radius: 30%;
    transform: translate(var(--x), var(--y));
  }
</style>
