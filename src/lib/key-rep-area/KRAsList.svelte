<script>
  import exercise, {
    selectedKeyRepArea,
  } from "$lib/key-rep-area/keyRepAreas.js";
  import SelectOneKeypointName from "$lib/inputs/SelectOneKeypoint.svelte";
  import keypointNames from "$lib/pose-detection/keypointNames.json";
</script>

<div style="height:100%; overflow-y:scroll;">
  {#if $exercise}
    {#each Object.entries($exercise.exerciseKeyRepAreas) as [focusLimbName, { keyRepAreas: keyRepAreasForLimb }] (focusLimbName)}
      <div class="KRAs-for-limb">
        <p>{focusLimbName}</p>
        <div>
          is start point (key rep area) same as end point?
          <input
            type="checkbox"
            name=""
            id=""
            bind:checked={$exercise.exerciseKeyRepAreas[focusLimbName]
              .startKeyRepAreaIsEnd}
          />
        </div>
        {#each keyRepAreasForLimb as keyRepArea, index (keyRepArea)}
          {@const { areaSize, topLeft } = keyRepArea}
          <div
            class="key-rep-area"
            style={`${
              $selectedKeyRepArea == keyRepArea
                ? "background-color: rgba(40,40,40,0.9); color: rgb(255,255,255);"
                : ""
            }`}
            on:dblclick={() => selectedKeyRepArea.select(keyRepArea)}
          >
            <p>{areaSize.width}x{areaSize.height}</p>
            <p>({topLeft.x}, {topLeft.y})</p>

            <SelectOneKeypointName
              {keypointNames}
              bind:selectedKeypoint={$exercise.exerciseKeyRepAreas[
                focusLimbName
              ].keyRepAreas[index].relativeToWhichKeypoint}
            />

            <button
              type="button"
              on:click={() => {
                exercise.deleteKRA(focusLimbName, keyRepArea);
              }}>delete🗑️</button
            >
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }

  .key-rep-area {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .key-rep-area > p {
    width: 55%;
  }
</style>
