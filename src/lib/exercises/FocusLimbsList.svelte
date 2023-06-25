<!-- List out detials of all focusLimbs (plus delete ability) -->

<script lang="ts">
  import type Exercise from "$lib/exercises";
  import KRAsList from "$lib/exercises/KRAsList.svelte";
  import exercises from "$lib/exercises/store";
  import KeyRepArea from "$lib/key-rep-area/keyRepArea";

  export let focusLimbs: Exercise["focusLimbs"];

  function addKRA(focusLimbName: string) {
    exercises.addKRAToSelectedExercise(focusLimbName, new KeyRepArea());
  }
</script>

<div style="height:100%; overflow-y:scroll;">
  {#if focusLimbs}
    {#each Object.entries(focusLimbs) as [focusLimbName, { keyRepAreas }] (focusLimbName)}
      <div class="KRAs-for-limb">
        <div>
          <p>{focusLimbName}</p>
          <button type="button" on:click={() => addKRA(focusLimbName)}
            >Add</button
          >
        </div>
        <div>
          is start point (key rep area) same as end point?
          <input
            type="checkbox"
            name=""
            id=""
            bind:checked={focusLimbs[focusLimbName].startKeyRepAreaIsEnd}
          />
        </div>
        <KRAsList bind:keyRepAreas {focusLimbName} />
      </div>
    {/each}
  {/if}
</div>

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }
</style>
