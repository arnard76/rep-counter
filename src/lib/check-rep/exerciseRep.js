import { writable } from "svelte/store";

import KeyRepArea from "$lib/check-rep/keyRepArea.js";

let exerciseRep = {
  keyAreas: {
    ...writable([]),

    /**
     * @param {Array<KeyRepArea>} newRepAreas - list of rep areas
     */
    addNewRepAreas(newRepAreas) {
      let verifiedRepAreas = [];
      for (let newRepArea of newRepAreas) {
        if (!(newRepArea instanceof KeyRepArea)) continue;

        verifiedRepAreas.push(newRepArea);
      }

      this.update((existingRepAreas) => {
        existingRepAreas.push(...verifiedRepAreas);
        return existingRepAreas;
      });
    },
  },
  exerciseName: "leg raise",
};

export default exerciseRep;
