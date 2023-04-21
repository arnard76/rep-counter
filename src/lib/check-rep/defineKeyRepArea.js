export class Area {
  relativeToWhichKeypoint = null;
  topLeft = null;
  areaSize = null;

  /**
   *
   * @param {string} keypointName
   * @param {{x : number, y :number}} topleft
   * @param {{width: number, height: number}} areaSize
   */
  constructor(keypointName, { x, y }, { width, height }) {
    this.relativeToWhichKeypoint = keypointName;
    this.topLeft = { x, y };
    this.areaSize = { width, height };
  }

  /**
   * Checks if a keypoint is in this area
   * @param {{x: number, y:number}} keypoint
   * @returns {boolean}
   */
  pointInArea(keypoints, keypoint) {
    if (!keypoint || !keypoints || !keypoints.length) return false;

    let relativeKeypoint = keypoints.find(
      (keypoint) => keypoint.name === this.relativeToWhichKeypoint
    );

    let absTopLeft = {
      x: relativeKeypoint.x + this.topLeft.x,
      y: relativeKeypoint.y + this.topLeft.y,
    };

    if (keypoint.x < absTopLeft.x) return false;
    if (keypoint.x > absTopLeft.x + this.areaSize.width) return false;
    if (keypoint.y < absTopLeft.y) return false;
    if (keypoint.y > absTopLeft.y + this.areaSize.height) return false;

    return true;
  }

  /**
   *
   * @param {Array} keypoints
   */
  calcAreaCorners(keypoints) {
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
}