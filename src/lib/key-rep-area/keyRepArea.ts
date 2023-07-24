import keypointNames from "$lib/pose-detection/keypointNames.json";
import { get } from "svelte/store";
import { scale } from "$lib/pose-detection/scaleKeypoints";
import type { Keypoint } from "$lib/pose-detection/";
import type { FormattedCorners } from ".";

const defaultKeyRepAreaTopLeft = { x: "20", y: "20" };
const defaultKeyRepAreaSize = { width: 40, height: 40 };

export default class KeyRepArea {
  relativeToWhichKeypoint: string;
  topLeft: typeof defaultKeyRepAreaTopLeft;
  areaSize: typeof defaultKeyRepAreaSize;

  constructor(
    relativeKeypointName = null,
    { x, y } = defaultKeyRepAreaTopLeft,
    { width, height } = defaultKeyRepAreaSize
  ) {
    if (!relativeKeypointName && !keypointNames.length) {
      throw Error(
        `keypointNames not an array with more than one keypoint name 😥 keypointNames: ${keypointNames}`
      );
    }

    this.relativeToWhichKeypoint = relativeKeypointName || keypointNames[0];
    this.topLeft = { x, y };
    this.areaSize = { width, height };
  }

  evaluateTopLeftToNumber(keypoints: any[] = []) {
    if (!keypoints) return { x: null, y: null };

    function getLimb(keypointName: Keypoint["name"]) {
      return (
        keypoints.find((kp) => kp.name === keypointName) ||
        (keypointNames.includes(keypointName) ? { x: 0, y: 0 } : undefined)
      );
    }

    function lengthBetween(
      keypoint1Name: Keypoint["name"],
      keypoint2Name: Keypoint["name"]
    ) {
      try {
        return Math.sqrt(
          (getLimb(keypoint1Name).x - getLimb(keypoint2Name).x) ** 2 +
            (getLimb(keypoint1Name).y - getLimb(keypoint2Name).y) ** 2
        );
      } catch (e) {
        console.log("the limb: ", keypoint1Name, keypoint2Name, keypoints);
      }
    }

    return {
      x: this.roundTo2SF(eval(this.topLeft.x) as number),
      y: this.roundTo2SF(eval(this.topLeft.y) as number),
    };
  }

  // keypoints cannot be scaled
  pointInArea(keypoints: Keypoint[], keypointName: string) {
    if (!this.relativeToWhichKeypoint) return false;
    if (!keypointName || !keypoints || !keypoints.length) return false;

    let relativeKeypoint = keypoints.find(
      (keypoint) => keypoint.name === this.relativeToWhichKeypoint
    );

    let absTopLeft = {
      x: relativeKeypoint.x + this.evaluateTopLeftToNumber(keypoints).x,
      y: relativeKeypoint.y + this.evaluateTopLeftToNumber(keypoints).y,
    };

    let focusKeypoint = keypoints.find((keypt) => keypt.name === keypointName);

    if (focusKeypoint.x < absTopLeft.x) return false;
    if (focusKeypoint.x > absTopLeft.x + this.areaSize.width) return false;
    if (focusKeypoint.y < absTopLeft.y) return false;
    if (focusKeypoint.y > absTopLeft.y + this.areaSize.height) return false;

    return true;
  }

  calcAreaCorners(keypoints: Keypoint[]): FormattedCorners {
    if (!this.relativeToWhichKeypoint) return;

    let relativeKeypoint = keypoints.find(
      (keypoint) => keypoint?.name === this.relativeToWhichKeypoint
    );

    if (!relativeKeypoint) return;

    let { x: originX, y: originY } = relativeKeypoint;
    let { x, y } = this.evaluateTopLeftToNumber(keypoints);
    let { width, height } = this.areaSize;

    return {
      absTopLeft: { x: originX + x, y: originY + y },
      relTopRight: { x: width, y: 0 },
      relBottomLeft: { x: 0, y: height },
      relBottomRight: { x: width, y: height },
    };
  }

  calcScaledAreaCorners(
    unscaledKeypoints: Keypoint[],
    { horizontal, vertical } = get(scale)
  ) {
    const unscaledCorners = this.calcAreaCorners(unscaledKeypoints);
    let scaledCorners = {};

    for (let [corner, { x, y }] of Object.entries(unscaledCorners)) {
      x = horizontal * x;
      y = vertical * y;
      scaledCorners[corner] = { x, y };
    }

    return scaledCorners as FormattedCorners;
  }

  setTopLeftFromMouseDrag({ offsetX, offsetY }) {
    this.topLeft = {
      x: (
        this.evaluateTopLeftToNumber([]).x +
        offsetX / get(scale).horizontal
      ).toFixed(2),
      y: (
        this.evaluateTopLeftToNumber([]).y +
        offsetY / get(scale).vertical
      ).toFixed(2),
    };
  }

  setAreaSizeFromMouseDrag({ offsetX, offsetY }) {
    this.areaSize = {
      width: this.roundTo2SF(
        this.areaSize.width - offsetX / get(scale).horizontal
      ),
      height: this.roundTo2SF(
        this.areaSize.height - offsetY / get(scale).vertical
      ),
    };
  }

  roundTo2SF(number: number) {
    return Number(number.toFixed(2));
  }

  static cloneInstance(existingKeyRepArea: KeyRepArea) {
    const { relativeToWhichKeypoint, topLeft, areaSize } = existingKeyRepArea;
    return new KeyRepArea(relativeToWhichKeypoint, topLeft, areaSize);
  }
}
