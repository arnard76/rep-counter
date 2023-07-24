<script lang="ts">
  import type KeyRepArea from "./keyRepArea";

  export let areaSize: KeyRepArea["areaSize"];
  export let updateAreaSize: (updated: KeyRepArea["areaSize"]) => void;

  let editing = false;
</script>

<div
  style="display: flex; align-items: center;width: 35%; justify-content: space-between;"
>
  {#if editing}
    <div class="pop-out">
      <input type="number" bind:value={areaSize.width} />
      <input type="number" bind:value={areaSize.height} />

      <button
        on:click={() => {
          editing = false;
          updateAreaSize(areaSize);
        }}>✅</button
      >
    </div>
  {:else}
    <slot />
    <button on:click={() => (editing = !editing)}>✏️</button>
  {/if}
</div>

<style>
  button {
    background-color: black;
    cursor: pointer;
    flex: 0;
  }

  .pop-out {
    position: absolute;
  }

  input[type="number"] {
    max-width: 150px;
  }
</style>
