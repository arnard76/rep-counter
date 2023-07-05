import type Area from "$lib/key-rep-area/keyRepArea";

export const finishedRep = -2;
export const canStartNextRep = -1;

export default class LimbRepCounter {
  focusLimbName: string;
  keyAreas: Area[];
  lastKeyAreaIndex: number;
  startKeyRepAreaIsEnd: boolean;

  numberOfReps = 0;

  constructor(
    focusLimbName: string,
    keyRepAreas: Area[],
    startKeyRepAreaIsEnd: boolean = true
  ) {
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

    this.focusLimbName = focusLimbName;
    this.keyAreas = keyRepAreas;
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
  updateRepProgress(keypoints: any[]) {
    if (this.lastKeyAreaIndex === finishedRep) return false;

    if (!this.isLimbInNextKeyArea(keypoints)) return false;

    this.lastKeyAreaIndex++;

    if (this.lastKeyAreaIndex < this.keyAreas.length - 1) return true;

    this.finishRep();
    return true;
  }

  // is limb in next area? return value true if yes
  isLimbInNextKeyArea(keypoints: any[]) {
    return this.keyAreas[this.lastKeyAreaIndex + 1].pointInArea(
      keypoints,
      this.focusLimbName
    );
  }
}
