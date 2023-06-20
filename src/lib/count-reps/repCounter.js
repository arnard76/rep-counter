import limbRepCounter, { finishedRep } from "$lib/count-reps/limbRepCounter.js";

class repCounter {
  numberOfReps = 0;

  constructor(exerciseName, keyRepAreas) {
    this.name = exerciseName;
    this.limbRepCounters = Object.entries(keyRepAreas).map(
      ([limbName, keyRepAreasForLimb]) => {
        return new limbRepCounter(limbName, keyRepAreasForLimb);
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
