<script lang="ts">
  import { onDestroy } from "svelte";
  import { writable } from "svelte/store";

  // grabbing the video file via html input
  let inputtedVideoFiles: FileList;
  export let updateVideoFile: (videoFile: File) => void;
  const acceptedVideoFileExtensions = ["mp4", "mpeg", "avi"];

  const updateVid = (vid) => {
    updateVideoFile(vid);
  };

  $: if (inputtedVideoFiles?.length) {
    let filename = inputtedVideoFiles[0].name.split(".");
    let fileExtensions = filename[filename.length - 1];

    if (acceptedVideoFileExtensions.includes(fileExtensions)) {
      updateVid(inputtedVideoFiles[0]);
    }
  }

  onDestroy(() => updateVid(null));
</script>

<input
  type="file"
  name=""
  id=""
  accept="*.mp4,*.mpeg,*.avi"
  bind:files={inputtedVideoFiles}
/>
