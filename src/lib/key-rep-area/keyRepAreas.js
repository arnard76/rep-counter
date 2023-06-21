import { writable, get } from "svelte/store";
import KeyRepArea from "$lib/key-rep-area/keyRepArea.js";

const keyRepAreas = createKRAsStore();

function createKRAsStore() {
  const store = writable(null);

  return {
    subscribe: store.subscribe,
    set: store.set,

    syncWithDatabase(newKRAsData) {
      store.set(turnKRAsDataToKRAInstances(newKRAsData));
    },

    /**
     * Adds KRA locally
     * NOTE: have to save in order to put in DB
     * @param {string} focusLimbName
     * @param {KeyRepArea} KRA
     */
    addKRA(focusLimbName, KRA) {
      if (!focusLimbName || !(typeof focusLimbName === "string")) {
        console.error(
          `this is not a valid focusLimbName (${focusLimbName}) as it is not a string (has type ${typeof focusLimbName})`
        );
        return;
      }

      if (!(KRA instanceof KeyRepArea)) {
        console.error(
          `this key rep area (${KRA}) is not of type KeyRepArea. It is type ${typeof keyArea}.`
        );
        return;
      }

      store.update(($exercise) => {
        if (!Object.keys($exercise.keyRepAreas).includes(focusLimbName)) {
          $exercise.keyRepAreas[focusLimbName] = [];
        }
        $exercise.keyRepAreas[focusLimbName].push(KRA);
        return $exercise;
      });
    },

    deleteKRA(focusLimbName, KRA) {
      store.update((currentKRAs) => {
        currentKRAs.keyRepAreas[focusLimbName].splice(
          currentKRAs.keyRepAreas[focusLimbName].indexOf(KRA),
          1
        );

        if (!currentKRAs.keyRepAreas[focusLimbName].length) {
          delete currentKRAs.keyRepAreas[focusLimbName];
        }

        return currentKRAs;
      });
    },
  };
}

function turnKRAsDataToKRAInstances(KRAsData) {
  if (!KRAsData) return;

  let exerciseKeyRepAreas = {};
  let keyRepAreasForLimb;
  for (let [focusLimbName, limbDetails] of Object.entries(
    KRAsData.exerciseKeyRepAreas
  )) {
    let { keyRepAreas: keyRepAreasForLimbObject } = limbDetails;
    let keyRepAreas = [];
    for (let {
      areaSize,
      topLeft,
      relativeToWhichKeypoint,
    } of keyRepAreasForLimbObject) {
      keyRepAreas.push(
        new KeyRepArea(relativeToWhichKeypoint, topLeft, areaSize)
      );
    }
    exerciseKeyRepAreas[focusLimbName] = {
      ...limbDetails,
      keyRepAreas,
    };
  }

  return { ...KRAsData, exerciseKeyRepAreas };
}

const { subscribe, set } = writable(null);
export const selectedKeyRepArea = {
  subscribe,
  select(KRA) {
    if (!(KRA instanceof KeyRepArea)) {
      console.error(
        `this key rep area (${KRA}) is not of type KeyRepArea. It is type ${typeof keyArea}.`
      );
      return;
    }

    set(KRA == get(selectedKeyRepArea) ? null : KRA);
  },
};

export default keyRepAreas;
