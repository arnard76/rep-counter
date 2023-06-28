import keypointNames from "$lib/pose-detection/keypointNames.json";

const defaultKeyRepAreaSize = { width: 40, height: 40 };
const defaultKeyRepAreaTopLeft = { x: 20, y: 20 };

export default class KeyRepArea {
  relativeToWhichKeypoint = null;
  topLeft = null;
  areaSize = null;

  constructor(
    relativeKeypointName: string = null,
    { x, y }: { x: number; y: number } = defaultKeyRepAreaTopLeft,
    { width, height }: { width: number; height: number } = defaultKeyRepAreaSize
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

  pointInArea(keypoints: any[], keypoint: string) {
    if (!this.relativeToWhichKeypoint) return false;
    if (!keypoint || !keypoints || !keypoints.length) return false;

    let relativeKeypoint = keypoints.find(
      (keypoint) => keypoint.name === this.relativeToWhichKeypoint
    );

    let absTopLeft = {
      x: relativeKeypoint.x + this.topLeft.x,
      y: relativeKeypoint.y + this.topLeft.y,
    };

    let focusKeypoint = keypoints.find((keypt) => keypt.name === keypoint);

    if (focusKeypoint.x < absTopLeft.x) return false;
    if (focusKeypoint.x > absTopLeft.x + this.areaSize.width) return false;
    if (focusKeypoint.y < absTopLeft.y) return false;
    if (focusKeypoint.y > absTopLeft.y + this.areaSize.height) return false;

    return true;
  }

  calcAreaCorners(keypoints: any[]) {
    if (!this.relativeToWhichKeypoint) return;

    let relativeKeypoint = keypoints.find(
      (keypoint) => keypoint?.name === this.relativeToWhichKeypoint
    );

    if (!relativeKeypoint) return;

    let { x: originX, y: originY } = relativeKeypoint;

    return {
      topLeft: { x: originX + this.topLeft.x, y: originY + this.topLeft.y },
      topRight: {
        x: originX + this.topLeft.x + this.areaSize.width,
        y: originY + this.topLeft.y,
      },
      bottomLeft: {
        x: originX + this.topLeft.x,
        y: originY + this.topLeft.y + this.areaSize.height,
      },
      bottomRight: {
        x: originX + this.topLeft.x + this.areaSize.width,
        y: originY + this.topLeft.y + this.areaSize.height,
      },
    };
  }

  static cloneInstance(existingKeyRepArea: KeyRepArea) {
    const { relativeToWhichKeypoint, topLeft, areaSize } = existingKeyRepArea;
    return new KeyRepArea(relativeToWhichKeypoint, topLeft, areaSize);
  }
}
