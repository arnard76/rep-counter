import * as tf from "@tensorflow/tfjs-core";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

async function createDetector() {
  await tf.ready();

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

  let estimate = await detector.estimatePoses(srcEl, {
    flippedHorizontal: false,
    scaled: 0.1,
  });
  return estimate;
}

export { getPose };
