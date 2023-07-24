<script>
  import { paused } from "$lib/paused";

  let pauseDelay = 5;
</script>

<!-- controlling pause/play ⏯️ -->
<div style="display: flex;">
  <button
    on:click={() => {
      paused.toggle();
    }}
  >
    {$paused ? "▶️" : "⏸️"}
  </button>

  {#if !$paused}
    <button
      on:click={() => {
        setTimeout(() => {
          paused.toggle();
        }, pauseDelay * 1000);
      }}
      >⏸️ in <input
        bind:value={pauseDelay}
        type="number"
        style="max-width: 50px;"
      /> s</button
    >{/if}
</div>
