<script>
  import { browser } from "$app/environment";
  // import {} from "$lib";

  let videoEl = null;

  let stream = null;
  $: if (browser) {
    window.navigator.mediaDevices.getUserMedia({ video: true }).then((res) => {
      console.log(res);
      console.log(res.getTracks());
      stream = res;
    });
  }

  $: if (stream) {
    videoEl.srcObject = stream;
    videoEl.play();
  }

  function captureVideo(video) {
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(video, 0, 0);
    return canvas.toDataURL("image/png");
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="" bind:this={videoEl} />
<button
  on:click={() => {
    window.alert("hi");
    console.log(captureVideo(videoEl));
  }}>click me</button
>
