<script>
  import * as poseDetection from "@tensorflow-models/pose-detection";
  import "@tensorflow/tfjs-backend-cpu";
  import "@tensorflow/tfjs-backend-webgl";
  import { onMount } from "svelte";

  const model = poseDetection.SupportedModels.PoseNet;

  async function createDetector() {
    return poseDetection.createDetector(model, {
      quantBytes: 4,
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: { width: 500, height: 500 },
      multiplier: 0.75,
    });
  }

  let detector;
  let fileEls;
  onMount(() => {
    createDetector().then((res) => (detector = res));
  });

  let submittingPose = false;
  let imgEl, dupeImgEl;
  async function submitPose() {
    submittingPose = true;
    if (!detector) {
      console.log("detector not defined");
      return;
    }
    console.log("submitting something", detector);
    let estimate = await detector.estimatePoses(imgEl, {
      flippedHorizontal: false,
      scaled: 0.5,
    });
    return estimate;
  }

  let estimateKeypoints;

  $: loading = !detector || submittingPose;
  $: console.log(fileEls);

  $: if (imgEl) {
    imgEl.onload = () => {
      URL.revokeObjectURL(imgEl.src); // no longer needed, free memory
    };
  }

  $: if (imgEl && fileEls) {
    imgEl.src = URL.createObjectURL(fileEls[0]); // set src to blob url
  }

  $: dupeImgEl = imgEl;
</script>

<input type="file" name="" id="" accept="*.png" bind:files={fileEls} />
<img bind:this={imgEl} alt="the uploaded 🤞" style="max-width:150px;" />
<button
  on:click={() => {
    submitPose().then((keypoints) => {
      submittingPose = false;
      estimateKeypoints = keypoints[0].keypoints;
    });
  }}
  disabled={loading}>submit file</button
>

{#if estimateKeypoints}
  <div style="position:relative;">
    <img bind:this={dupeImgEl} alt="the duplicate" style="max-width:150px;" />
    <div id="diagram" style="position:absolute; ">
      {#each estimateKeypoints as keypoint (keypoint)}
        <div
          class="keypoint"
          style={`--x: ${keypoint.x}px; --y: ${keypoint.y}px;`}
        />
      {/each}
    </div>
  </div>
  <p>{JSON.stringify(estimateKeypoints)}</p>
{/if}

<style>
  .keypoint {
    --x: 0;
    --y: 0;
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 0, 25, 0.7);
    border-radius: 30%;
    transform: translate(var(--x), var(--y));
  }
</style>
