<script lang="ts">
  import KeyRepArea from "./keyRepArea";

  export let topLeft: KeyRepArea["topLeft"];
  export let updateTopLeft: (updated: KeyRepArea["topLeft"]) => void;

  // $: !editing && updateTopLeft(topLeft);
  const testKeyRepArea = new KeyRepArea();
  let editing = false;
  let failed = false;
</script>

<div
  style="display: flex; align-items: center;width: 35%; justify-content: space-between;"
>
  {#if editing}
    <div class="pop-out">
      {#if failed}
        <p>not a valid topLeft expression: {JSON.stringify(topLeft)}</p>
      {/if}
      <textarea bind:value={topLeft.x} />
      <textarea bind:value={topLeft.y} />

      <button
        on:click={() => {
          failed = false;
          testKeyRepArea.topLeft = topLeft;

          try {
            testKeyRepArea.evaluateTopLeftToNumber([]);
          } catch (e) {
            console.log("won't update because top left is not valid");
            failed = true;
            return;
          }

          editing = false;
          updateTopLeft(topLeft);
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

  textarea {
    max-width: 150px;
  }
</style>
