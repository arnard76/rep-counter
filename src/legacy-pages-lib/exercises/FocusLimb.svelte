<script lang="ts">
  import KRAsList from "$legacy-pages-lib/exercises/KRAsList.svelte";
  import KeyRepArea from "$legacy-pages-lib/key-rep-area/keyRepArea";

  export let focusLimbName: string;
  export let keyRepAreas: KeyRepArea[];
  export let startKeyRepAreaIsEnd: boolean;
  export let updateStartKeyRepAreaIsEnd: (updated: boolean) => void;
  export let updateKeyRepAreas: (updated: KeyRepArea[]) => void;

  function hideEnd() {
    keyRepAreas.pop();
  }

  function showHiddenEnd() {
    keyRepAreas.push(KeyRepArea.cloneInstance(keyRepAreas[0]));
  }

  function onCheckboxChange({ target }: Event) {
    (target as HTMLInputElement).checked ? hideEnd() : showHiddenEnd();
    updateStartKeyRepAreaIsEnd((target as HTMLInputElement).checked);
    updateKeyRepAreas(keyRepAreas);
  }
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

  <KRAsList {keyRepAreas} {updateKeyRepAreas} {startKeyRepAreaIsEnd} />

  <button
    on:click={() => updateKeyRepAreas([...keyRepAreas, new KeyRepArea()])}
  >
    Add KRA
  </button>
</div>

<style>
  .KRAs-for-limb {
    background-color: rgba(0, 25, 35, 0.15);
    margin-top: 20px;
  }
</style>
