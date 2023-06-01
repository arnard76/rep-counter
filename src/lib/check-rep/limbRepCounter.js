import Area from "$lib/check-rep/keyRepArea.js";

export const finishedRep = -2;
export const canStartNextRep = -1;

export default class LimbRepCounter {
  numberOfReps = 0;

  /**
   * @param {string} focusLimbName
   * @param {Array<Area>} keyRepAreas - Array of key rep areas
   */
  constructor(focusLimbName, keyRepAreas) {
    if (!keyRepAreas.length) {
      throw Error(
        "keyAreas must be not be empty. Include all the key areas of a rep for this limb in input Array."
      );
    }

    if (keyRepAreas.length === 1) {
      throw Error(
        "keyAreas has to have a start point & endpoint and they can't be the same so add at least two key areas to input Array."
      );
    }

    // check if all elements are keyArea types
    for (let keyArea of keyRepAreas) {
      if (!(keyArea instanceof Area)) {
        throw Error(
          `one of the key areas (${keyArea}) is not of type KeyRepArea. It is type ${typeof keyArea}.`
        );
      }
    }

    this.focusLimbName = focusLimbName;
    this.keyAreas = keyRepAreas;
    this.lastKeyAreaIndex = -1; // hasn't started a rep yet
  }

  finishRep() {
    this.numberOfReps++;
    this.lastKeyAreaIndex = finishedRep;
  }

  getReadyForNextRep() {
    this.lastKeyAreaIndex = canStartNextRep;
  }

  /**
   *
   * @param {Array} keypoints - list of all keypoints
   * @returns {boolean} - was the rep updated? true means yes
   */
  updateRepProgress(keypoints) {
    if (this.lastKeyAreaIndex === finishedRep) return false;

    if (!this.isLimbInNextKeyArea(keypoints, this.focusLimbName)) return false;

    this.lastKeyAreaIndex++;

    if (this.lastKeyAreaIndex < this.keyAreas.length - 1) return true;

    this.finishRep();
    return true;
  }

  /**
   *
   * @param {Array} keypoints - list of all keypoints
   * @returns {boolean} - is limb in next area
   */
  isLimbInNextKeyArea(keypoints) {
    if (
      !this.keyAreas[this.lastKeyAreaIndex + 1].pointInArea(
        keypoints,
        this.focusLimbName
      )
    )
      return false;

    return true;
  }

  getStartPoint() {
    return this.keyAreas[0];
  }

  getEndpoint() {
    return this.keyAreas.slice(-1)[0];
  }
}
