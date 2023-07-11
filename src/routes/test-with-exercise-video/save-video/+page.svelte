<script>
  import UserVideo from "$legacy-pages-lib/video/LiveVideo.svelte";
  import videoEl from "$legacy-pages-lib/video/video";
</script>

<UserVideo />
{#if $videoEl}
  <button
    on:click={() => {
      const types = [
        "video/webm",
        "audio/webm",
        "video/webm;codecs=vp8",
        "video/webm;codecs=daala",
        "video/webm;codecs=h264",
        "audio/webm;codecs=opus",
        "video/mpeg",
        "video/mp4",
      ];

      for (const type of types) {
        console.log(
          `Is ${type} supported? ${
            MediaRecorder.isTypeSupported(type) ? "Maybe!" : "Nope :("
          }`
        );
      }

      const mediaRecorder = new MediaRecorder($videoEl.srcObject, {
        mimeType: "video/webm;codecs=vp8",
        bitsPerSecond: 128,
      });
      mediaRecorder.addEventListener("dataavailable", (newData) => {
        console.log(newData);
        console.log(URL.createObjectURL(newData.data));
      });
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 15000);
    }}>see details</button
  >
{/if}
