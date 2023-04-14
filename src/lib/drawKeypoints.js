import * as poseDetection from "@tensorflow-models/pose-detection";

const color = "blue";
const lineColor = "green";
const boundingBoxColor = "red";
const lineWidth = 2;

export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.stroke();
}

function toTuple({ y, x }) {
  return [y, x];
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(keypoints, ctx, scale = 1) {
  const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet
  );

  adjacentKeyPoints.forEach((twoAdjacentKeypoints) => {
    drawSegment(
      toTuple(keypoints[twoAdjacentKeypoints[0]]),
      toTuple(keypoints[twoAdjacentKeypoints[1]]),
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

/**
 *  Connect the keypoints (in order) using line segments
 * @param {Array} keypoints
 * @param {*} ctx
 */
export function connectTheDots(keypoints, ctx) {
  for (
    let indexCounter = 0;
    indexCounter <= keypoints.length - 2;
    indexCounter++
  ) {
    drawSegment(
      toTuple(keypoints[indexCounter]),
      toTuple(keypoints[indexCounter + 1]),
      color,
      1,
      ctx
    );
  }
}
/**
 *  transforms keypoints to visible diagram
 *
 * @param {Object} pose
 * @param {number} videoWidth
 * @param {number} videoHeight
 * @param {HTMLElement} canvas
 */
export function drawCanvas(pose, videoWidth, videoHeight, canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  drawKeypoints(pose["keypoints"], 0.0, ctx);
  drawSkeleton(pose["keypoints"], ctx);
}
