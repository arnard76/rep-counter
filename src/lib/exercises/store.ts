import { writable, get, derived } from "svelte/store";
import type Exercise from "$lib/exercises";
import type { Exercises, ExercisesData } from "$lib/exercises";
import KeyRepArea from "$lib/key-rep-area/keyRepArea";
import { streamExercisesFromDB } from "$lib/exercises/CRUD/crudDB";
import { browser } from "$app/environment";

const exercises = createExercisesStore();

function createExercisesStore() {
  const store = writable(null as Exercises, () => {
    console.log("subscribed to exercises");
    let stopReadingDatabase = browser ? streamExercisesFromDB() : () => {};

    return () => {
      console.log("no more subscribers for exercises");
      stopReadingDatabase();
    };
  });

  /**
   * Adds KRA locally
   * NOTE: have to save in order to put in DB
   */
  function addKRAToExercise(
    exerciseId: string,
    focusLimbName: string,
    KRA: KeyRepArea
  ) {
    store.update(($exercises) => {
      if ($exercises[exerciseId]) {
        if (
          !Object.keys($exercises[exerciseId].focusLimbs).includes(
            focusLimbName
          )
        ) {
          $exercises[exerciseId].focusLimbs[focusLimbName] = {
            keyRepAreas: [],
          };
        }

        $exercises[exerciseId].focusLimbs[focusLimbName].keyRepAreas.push(KRA);
      } else {
        console.error(
          `this exercise with id: ${exerciseId}, doesn't exist in $exercises:\n ${get(
            store
          )}.`
        );
      }

      return $exercises;
    });
  }

  function deleteKRAInExercise(
    exerciseId: string,
    focusLimbName: string,
    KRA: KeyRepArea
  ) {
    store.update(($exercises) => {
      if ($exercises[exerciseId]) {
        const indexOfKRA =
          $exercises[exerciseId].focusLimbs[focusLimbName].keyRepAreas.indexOf(
            KRA
          );

        if (indexOfKRA === -1) {
          console.error(
            `this KRA ${KRA}, doesn't exist in this limb ${focusLimbName} of this $exercise: ${exerciseId}\n ${$exercises[exerciseId].focusLimbs[focusLimbName].keyRepAreas}.`
          );
          return $exercises;
        }

        $exercises[exerciseId].focusLimbs[focusLimbName].keyRepAreas.splice(
          indexOfKRA,
          1
        );

        if (
          !$exercises[exerciseId].focusLimbs[focusLimbName].keyRepAreas.length
        ) {
          delete $exercises[exerciseId].focusLimbs[focusLimbName];
        }
      } else {
        console.error(
          `this exercise with id: ${exerciseId}, doesn't exist in $exercises:\n ${get(
            store
          )}.`
        );
      }

      return $exercises;
    });
  }

  return {
    subscribe: store.subscribe,
    set: store.set,

    syncWithDatabase(updatedExercisesData: ExercisesData) {
      store.set(createKRAInstancesFromKRAObjects(updatedExercisesData));
    },

    addKRAToSelectedExercise(focusLimbName: string, KRA: KeyRepArea) {
      const exerciseId = get(selectedExerciseId);
      addKRAToExercise(exerciseId, focusLimbName, KRA);
    },

    deleteKRAInSelectedExercise(focusLimbName: string, KRA: KeyRepArea) {
      const exerciseId = get(selectedExerciseId);
      deleteKRAInExercise(exerciseId, focusLimbName, KRA);
    },
  };
}

function createKRAInstancesFromKRAObjects(exercisesData: ExercisesData) {
  if (!exercisesData) return;

  let exercises: Exercises = {};

  for (const [exerciseId, exerciseData] of Object.entries(exercisesData)) {
    let exercise: Exercise = {
      ...exerciseData,
      focusLimbs: {},
    };

    console.log(exerciseData);
    for (const [
      limbName,
      { keyRepAreas, startKeyRepAreaIsEnd },
    ] of Object.entries(exerciseData.focusLimbs || {})) {
      exercise.focusLimbs[limbName] = {
        startKeyRepAreaIsEnd,
        keyRepAreas: keyRepAreas.map(
          ({ relativeToWhichKeypoint, topLeft, areaSize }) =>
            new KeyRepArea(relativeToWhichKeypoint, topLeft, areaSize)
        ),
      };
    }

    exercises[exerciseId] = exercise;
  }

  return exercises;
}

export const selectedExerciseId = {
  ...writable(null),
  select(exerciseId: string) {
    this.set(exerciseId === get(selectedExerciseId) ? null : exerciseId);
  },
};

export const selectedExercise = derived(
  [exercises, selectedExerciseId],
  ([$exercises, $selectedExerciseId], set) => {
    if (!$exercises) {
      set(undefined);
      return;
    }

    let found = $exercises[$selectedExerciseId];

    set($exercises ? found : undefined);
  },
  undefined as Exercise
);

export default exercises;
