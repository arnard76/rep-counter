import Area from "$lib/check-rep/keyRepArea.js";

export class RepsCounter {
  numberOfReps = 0;

  /**
   * @param {Array<Area>} keyAreas - Array of key rep areas
   */
  constructor(keyAreas) {
    if (!keyAreas.length) {
      throw Error(
        "keyAreas must be not be empty. Include all the key areas of this exercise's rep in input Array."
      );
    }

    if (keyAreas.length === 1) {
      throw Error(
        "keyAreas has to have a start point & endpoint and they can't be the same so add at least two key areas to input Array."
      );
    }

    // check if all elements are keyArea types - how?

    this.keyAreas = keyAreas;
    this.lastKeyAreaIndex = -1; // hasn't started a rep yet
  }

  /**
   *
   * @param {Array} keypoints - list of all keypoints
   * @param {string} limbKeypoint - name of the limb being tracked
   * @returns
   */
  isLimbInNextKeyArea(keypoints, limbKeypoint) {
    if (
      !this.keyAreas[this.lastKeyAreaIndex + 1].pointInArea(
        keypoints,
        limbKeypoint
      )
    )
      return false;

    this.lastKeyAreaIndex++;

    if (this.lastKeyAreaIndex < this.keyAreas.length - 1) return true;

    this.numberOfReps++;
    this.lastKeyAreaIndex = -1;
    return true;
  }

  getStartPoint() {
    return this.keyAreas[0];
  }

  getEndpoint() {
    return this.keyAreas.slice(-1)[0];
  }
}
