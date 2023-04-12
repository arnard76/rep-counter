import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

async function createDetector() {
  const model = poseDetection.SupportedModels.MoveNet;
  const modelType = poseDetection.movenet.modelType.SINGLEPOSE_THUNDER;

  return poseDetection.createDetector(model, { modelType });
}

let detector = null;
createDetector().then((res) => (detector = res));

async function getPose(srcEl) {
  if (!detector) {
    console.log("detector not defined", detector);
    return;
  }
  console.log("submitting something", detector);
  let estimate = await detector.estimatePoses(srcEl, {
    flippedHorizontal: false,
    scaled: 0.1,
  });
  return estimate;
}

export { getPose };
