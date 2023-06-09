<script>
  import exercise from "$lib/key-rep-area/keyRepAreas.js";
  import KeyRepArea from "$lib/key-rep-area/keyRepArea.js";
  import {
    streamKRAsFromDB,
    updateKRAsOnDB,
  } from "$lib/key-rep-area/CRUD/crudDB.js";

  import { onDestroy, onMount } from "svelte";
  import KRAsList from "$lib/key-rep-area/KRAsList.svelte";
  import SelectOneKeypoint from "$lib/inputs/SelectOneKeypoint.svelte";
  import keypointNames from "$lib/pose-detection/keypointNames.json";

  let stopReadingDatabase = () => {};
  onMount(() => (stopReadingDatabase = streamKRAsFromDB()));
  onDestroy(stopReadingDatabase);

  let focusLimbNameInput = null;

  function addKRA() {
    exercise.addKRA(focusLimbNameInput, new KeyRepArea());
  }
</script>

<div style="width: 100%; max-height: 40vh;">
  <div>
    <button type="button" on:click={() => updateKRAsOnDB($exercise)}>
      Update Database
    </button>

    <div style="background-color: gray;">
      <h3>Add a new Key rep area</h3>
      <div style="display:flex;align-items:center;">
        <p style="margin-right: 20px;">what is the focus point for KRA?</p>
        <SelectOneKeypoint
          {keypointNames}
          bind:selectedKeypoint={focusLimbNameInput}
        />
        <button type="button" on:click={addKRA}>Add</button>
      </div>
    </div>
  </div>

  <KRAsList />
</div>
