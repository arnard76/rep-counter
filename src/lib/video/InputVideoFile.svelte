<script lang="ts">
  import { writable } from "svelte/store";

  // grabbing the video file via html input
  let inputtedVideoFiles: FileList;
  const validVideoFileSTRONG = writable(null);
  export const validVideoFile = { subscribe: validVideoFileSTRONG.subscribe };
  const acceptedVideoFileExtensions = ["mp4", "mpeg", "avi"];

  $: if (inputtedVideoFiles?.length) {
    let filename = inputtedVideoFiles[0].name.split(".");
    let fileExtensions = filename[filename.length - 1];

    if (acceptedVideoFileExtensions.includes(fileExtensions)) {
      $validVideoFileSTRONG = inputtedVideoFiles[0];
    }
  }
</script>

<input
  type="file"
  name=""
  id=""
  accept="*.mp4,*.mpeg,*.avi"
  bind:files={inputtedVideoFiles}
/>
