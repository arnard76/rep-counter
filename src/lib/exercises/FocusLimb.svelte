<script lang="ts">
  import KRAsList from "$lib/exercises/KRAsList.svelte";
  import KeyRepArea from "$lib/key-rep-area/keyRepArea";

  export let focusLimbName: string;
  export let keyRepAreas: KeyRepArea[];
  export let startKeyRepAreaIsEnd: boolean;
  export let updateStartKeyRepAreaIsEnd: (updated: boolean) => void;
  export let updateKeyRepAreas: (updated: KeyRepArea[]) => void;

  function makeEndKRASameAsStart() {
    keyRepAreas[keyRepAreas.length - 1] = keyRepAreas[0];
  }

  function seperateStartEnd() {
    keyRepAreas[keyRepAreas.length - 1] = KeyRepArea.cloneInstance(
      keyRepAreas[keyRepAreas.length - 1]
    );
  }

  function addKRA() {
    const defaultKRA = new KeyRepArea();
    keyRepAreas.push(defaultKRA);
    const length = keyRepAreas.length;

    if (length >= 2 && startKeyRepAreaIsEnd) {
      keyRepAreas[length - 1] = keyRepAreas[length - 2];
      keyRepAreas[length - 2] = defaultKRA;
    }
    updateKeyRepAreas(keyRepAreas);
  }

  function onCheckboxChange({ target }: Event) {
    // because typescript doesn't work in the HTML section 🤔
    onStartEndSameChange((target as HTMLInputElement).checked);
  }

  function onStartEndSameChange(updated: boolean) {
    updated ? makeEndKRASameAsStart() : seperateStartEnd();
    updateStartKeyRepAreaIsEnd(updated);
    updateKeyRepAreas(keyRepAreas);
  }

  onStartEndSameChange(startKeyRepAreaIsEnd);
</script>

<div class="KRAs-for-limb">
  <h3>{focusLimbName}</h3>

  <div>
    start & end point (key rep area) are same?
    <input
      type="checkbox"
      name=""
      id=""
      on:change={onCheckboxChange}
      checked={startKeyRepAreaIsEnd}
    />
  </div>

  <KRAsList {keyRepAreas} {updateKeyRepAreas} {focusLimbName} />
  <button type="button" on:click={addKRA}> Add new KRA </button>
</div>

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }
</style>
