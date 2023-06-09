import { writable } from "svelte/store";
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

  let keyRepAreas = {};
  let keyRepAreasForLimb;
  for (let [focusLimbName, keyRepAreasForLimbObject] of Object.entries(
    KRAsData.keyRepAreas
  )) {
    keyRepAreasForLimb = [];
    for (let {
      areaSize,
      topLeft,
      relativeToWhichKeypoint,
    } of keyRepAreasForLimbObject) {
      keyRepAreasForLimb.push(
        new KeyRepArea(relativeToWhichKeypoint, topLeft, areaSize)
      );
    }
    keyRepAreas[focusLimbName] = keyRepAreasForLimb;
  }

  return { exerciseName: KRAsData.exerciseName, keyRepAreas };
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
