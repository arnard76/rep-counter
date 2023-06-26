import limbRepCounter, { finishedRep } from "$lib/count-reps/limbRepCounter.js";

class repCounter {
  numberOfReps = 0;

  constructor(focusLimbs) {
    this.limbRepCounters = Object.entries(focusLimbs).map(
      ([limbName, { keyRepAreas, startKeyRepAreaIsEnd }]) => {
        return new limbRepCounter(limbName, keyRepAreas, startKeyRepAreaIsEnd);
      }
    );
  }

  /**
   *
   * @param {Array} keypoints - list of all keypoints
   * @returns {boolean} - was the rep count/index updated? true means yes
   */
  updateRepProgress(keypoints) {
    let wasUpdated = false;
    let readyForNextRep = true;
    for (let limbRepCounter of this.limbRepCounters) {
      if (limbRepCounter.updateRepProgress(keypoints) && !wasUpdated) {
        wasUpdated = true;
      }

      if (limbRepCounter.lastKeyAreaIndex != finishedRep) {
        readyForNextRep = false;
      }
    }

    if (readyForNextRep) {
      this.numberOfReps++;
      for (let limbRepCounter of this.limbRepCounters) {
        limbRepCounter.getReadyForNextRep();
      }
    }
    return wasUpdated;
  }
}

export default repCounter;
