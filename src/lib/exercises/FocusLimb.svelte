<script lang="ts">
  import exercises from "./store";
  import KRAsList from "$lib/exercises/KRAsList.svelte";
  import KeyRepArea from "$lib/key-rep-area/keyRepArea";

  export let focusLimbName: string;
  export let keyRepAreas: KeyRepArea[];
  export let startKeyRepAreaIsEnd: boolean;

  function makeEndKRASameAsStart() {
    keyRepAreas[keyRepAreas.length - 1] = keyRepAreas[0];
  }

  function seperateStartEnd() {
    keyRepAreas[keyRepAreas.length - 1] = KeyRepArea.cloneInstance(
      keyRepAreas[0]
    );
  }

  $: startKeyRepAreaIsEnd ? makeEndKRASameAsStart() : seperateStartEnd();

  function addKRA(focusLimbName: string) {
    exercises.addKRAToSelectedExercise(focusLimbName, new KeyRepArea());
  }
</script>

<div class="KRAs-for-limb">
  <h3>{focusLimbName}</h3>

  <div>
    start & end point (key rep area) are same?
    <input type="checkbox" name="" id="" bind:checked={startKeyRepAreaIsEnd} />
  </div>

  <KRAsList bind:keyRepAreas {focusLimbName} />
  <button type="button" on:click={() => addKRA(focusLimbName)}>
    Add new KRA
  </button>
</div>

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }
</style>
