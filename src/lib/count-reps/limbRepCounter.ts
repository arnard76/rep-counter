import type Area from "$lib/key-rep-area/keyRepArea";
import type { Keypoint } from "$lib/pose-detection";

export const finishedRep = -2;
export const canStartNextRep = -1;

export default class LimbRepCounter {
  focusLimbName: string;
  keyAreas: Area[]; // includes hidden last KRA (if applicable)
  lastKeyAreaIndex: number;
  startKeyRepAreaIsEnd: boolean;

  numberOfReps = 0;

  constructor(
    focusLimbName: string,
    keyRepAreas: Area[],
    startKeyRepAreaIsEnd: boolean = true
  ) {
    if (keyRepAreas.length < 2) {
      throw Error(
        "an limb rep counter needs at least 2 key rep areas. And if start & end are the same, the end KRA can not be counted as one of the minimum two KRA's required."
      );
    }

    this.focusLimbName = focusLimbName;
    this.keyAreas = startKeyRepAreaIsEnd
      ? [...keyRepAreas, keyRepAreas[0]]
      : keyRepAreas;
    this.lastKeyAreaIndex = -1; // hasn't started a rep yet
    this.startKeyRepAreaIsEnd = startKeyRepAreaIsEnd;
  }

  finishRep() {
    this.numberOfReps++;
    this.lastKeyAreaIndex = finishedRep;
  }

  getReadyForNextRep() {
    //  0 represents the 1st key rep area
    this.lastKeyAreaIndex = this.startKeyRepAreaIsEnd ? 0 : canStartNextRep;
  }

  // was the rep updated? return value of true means yes
  updateRepProgress(keypoints: Keypoint[]) {
    if (this.lastKeyAreaIndex === finishedRep) return false;

    if (!this.isLimbInNextKeyArea(keypoints)) return false;

    this.lastKeyAreaIndex++;

    if (this.lastKeyAreaIndex < this.keyAreas.length - 1) return true;

    this.finishRep();
    return true;
  }

  // is limb in next area? return value true if yes
  isLimbInNextKeyArea(keypoints: Keypoint[]) {
    return this.keyAreas[this.lastKeyAreaIndex + 1].pointInArea(
      keypoints,
      this.focusLimbName
    );
  }
}
