import keypointNames from "$lib/pose-detection/keypointNames.json";

const defaultKeyRepAreaSize = { width: 40, height: 40 };
const defaultKeyRepAreaTopLeft = { x: 20, y: 20 };

export default class KeyRepArea {
  relativeToWhichKeypoint = null;
  topLeft = null;
  areaSize = null;

  /**
   *
   * @param {string} relativeKeypointName
   * @param {{x : number, y :number}} topleft
   * @param {{width: number, height: number}} areaSize
   */
  constructor(
    relativeKeypointName,
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

  /**
   * Checks if a keypoint is in this area
   * @param {Array} keypoints - array of all keypoints (not just names)
   * @param {string} keypoint - name of keypoint
   * @returns {boolean}
   */
  pointInArea(keypoints, keypoint) {
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

  /**
   *
   * @param {Array} keypoints
   */
  calcAreaCorners(keypoints) {
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

  cloneInstance() {
    return new KeyRepArea(
      this.relativeToWhichKeypoint,
      this.topLeft,
      this.areaSize
    );
  }
}
