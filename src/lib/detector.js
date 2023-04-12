import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { writable } from "svelte/store";

const model = poseDetection.SupportedModels.MoveNet;

async function createDetector() {
  // let modelType = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
  //   let modelUrl = STATE.modelConfig.customModel;
  return poseDetection.createDetector(model, {
    // quantBytes: 4,
    // architecture: "MobileNetV1",
    // outputStride: 16,
    // inputResolution: { width: 480, height: 640 },
    // multiplier: 0.75,
    // modelType,
    // runtime: "tfjs"
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  });
}

let detector = null;
createDetector().then((res) => (detector = res));

let submittingPose = writable(false);

async function submitPose(srcEl) {
  submittingPose.set(true);
  if (!detector) {
    console.log("detector not defined");
    return;
  }
  console.log("submitting something", detector);
  let estimate = await detector.estimatePoses(srcEl, {
    flippedHorizontal: false,
    scaled: 0.1,
  });
  submittingPose.set(false);
  return estimate;
}

export { submitPose, submittingPose };
