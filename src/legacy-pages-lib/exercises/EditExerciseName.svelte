<script>
  export let name;

  let editing = false;
</script>

<div style="display: flex; align-items: center;">
  {#if editing}
    <input type="text" name="" bind:value={name} />
  {:else}
    <p>{name}</p>
  {/if}

  <button on:click={() => (editing = !editing)}>{editing ? "✅" : "✏️"}</button>
</div>

<style>
  button {
    margin-left: 5px;
    cursor: pointer;
  }
</style>
