<script>
  import { getPose } from "$lib/pose-detection/detector.js";
  // import { captureVideo } from "$lib/video/frameCapture.js";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";
  import KeypointsOverlay from "$lib/common-shapes/KeypointsOverlay.svelte";

  let videoEl = null;
  // let imageSrcEl = null;
  let stream = null;
  let keypoints = null;

  $: if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((res) => (stream = res));
  }

  $: if (stream) {
    videoEl.srcObject = stream;
    videoEl.play();
  }

  let snapAndDetect;
  $: if (videoEl) {
    snapAndDetect = setInterval(() => {
      // imageSrcEl.src = captureVideo(videoEl);
      getPose(videoEl).then((res) => {
        if (!res) return;
        console.log(res);
        keypoints = res[0].keypoints;
      });
    }, 500);
  }

  onDestroy(() => {
    clearInterval(snapAndDetect);
  });
</script>

<!-- svelte-ignore a11y-media-has-caption -->

<div style="position:relative;">
  <video src="" bind:this={videoEl} />
  <!-- <img
    src=""
    alt="latest-snapshot-from-video-stream"
    style="display:none;"
    bind:this={imageSrcEl}
  /> -->

  <KeypointsOverlay {keypoints} />
</div>
