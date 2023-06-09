<script>
  import {
    updateKRAsOnDB,
    streamKRAsFromDB,
  } from "$lib/key-rep-area/CRUD/crudDB.js";
  import { onDestroy, onMount } from "svelte";
  import kRAsStore from "$lib/key-rep-area/keyRepAreas.js";
  import { browser } from "$app/environment";

  let stopReadingDatabase = () => {};

  onMount(() => {
    if (!browser) return;
    stopReadingDatabase = streamKRAsFromDB();
  });

  onDestroy(() => {
    stopReadingDatabase();
  });

  $: exerciseName = $kRAsStore?.exerciseName;
</script>

<button
  type="button"
  on:click={() => {
    updateKRAsOnDB($kRAsStore);
  }}
>
  Update database
</button>

<p>{exerciseName}</p>
{#if $kRAsStore}
  {#each Object.entries($kRAsStore.keyRepAreas) as [focusLimbName, keyRepAreasForLimb] (focusLimbName)}
    <div class="KRAs-for-limb">
      <p>{focusLimbName}</p>

      {#each keyRepAreasForLimb as keyRepArea (keyRepArea)}
        <div class="key-rep-area">
          <p>{JSON.stringify(keyRepArea)}</p>

          <button
            type="button"
            on:click={() => {
              kRAsStore.deleteKRA(focusLimbName, keyRepArea);
            }}>delete🗑️</button
          >
        </div>
      {/each}
    </div>
  {/each}
{/if}

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }

  .key-rep-area {
    display: flex;
    align-items: center;
  }

  .key-rep-area > p {
    width: 55%;
  }

  button {
    background: black;
    color: white;
    border-radius: 20px;
    padding: 5px 20px;
    cursor: pointer;
  }
</style>
