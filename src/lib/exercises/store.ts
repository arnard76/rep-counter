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

  function getIndexOfExercise(exerciseId: Exercise["id"]) {
    return get(store).findIndex(({ id }) => id === exerciseId);
  }

  /**
   * Adds KRA locally
   * NOTE: have to save in order to put in DB
   */
  function addKRAToExercise(
    exerciseId: Exercise["id"],
    focusLimbName: string,
    KRA: KeyRepArea
  ) {
    const indexOfExercise = getIndexOfExercise(exerciseId);

    if (indexOfExercise === -1) {
      console.error(
        `this exercise with id: ${exerciseId}, doesn't exist in $exercises:\n ${get(
          store
        )}.`
      );
      return;
    }

    store.update(($exercises) => {
      if (
        !Object.keys($exercises[indexOfExercise].focusLimbs).includes(
          focusLimbName
        )
      ) {
        $exercises[indexOfExercise].focusLimbs[focusLimbName].keyRepAreas = [];
      }
      $exercises[indexOfExercise].focusLimbs[focusLimbName].keyRepAreas.push(
        KRA
      );
      return $exercises;
    });
  }

  function deleteKRAInExercise(
    exerciseId: Exercise["id"],
    focusLimbName: string,
    KRA: KeyRepArea
  ) {
    const indexOfExercise = getIndexOfExercise(exerciseId);

    if (indexOfExercise === -1) {
      console.error(
        `this exercise with id: ${exerciseId}, doesn't exist in $exercises:\n ${get(
          store
        )}.`
      );
      return;
    }

    store.update(($exercises) => {
      const indexOfKRA =
        $exercises[indexOfExercise].focusLimbs[
          focusLimbName
        ].keyRepAreas.indexOf(KRA);

      if (indexOfKRA === -1) {
        console.error(
          `this KRA ${KRA}, doesn't exist in this limb ${focusLimbName} of this $exercise: ${exerciseId}\n ${$exercises[indexOfExercise].focusLimbs[focusLimbName].keyRepAreas}.`
        );
        return $exercises;
      }

      $exercises[indexOfExercise].focusLimbs[focusLimbName].keyRepAreas.splice(
        indexOfKRA,
        1
      );

      if (
        !$exercises[indexOfExercise].focusLimbs[focusLimbName].keyRepAreas
          .length
      ) {
        delete $exercises[indexOfExercise].focusLimbs[focusLimbName];
      }

      return $exercises;
    });
  }

  return {
    subscribe: store.subscribe,
    set: store.set,
    getIndexOfExercise,

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

  let exercises: Exercises = [];

  for (const exerciseData of exercisesData) {
    let exercise: Exercise = { ...exerciseData, focusLimbs: {} };

    for (const [
      limbName,
      { keyRepAreas, startKeyRepAreaIsEnd },
    ] of Object.entries(exerciseData.focusLimbs)) {
      exercise.focusLimbs[limbName] = {
        startKeyRepAreaIsEnd,
        keyRepAreas: keyRepAreas.map(
          ({ relativeToWhichKeypoint, topLeft, areaSize }) =>
            new KeyRepArea(relativeToWhichKeypoint, topLeft, areaSize)
        ),
      };
    }

    exercises.push(exercise);
  }

  return exercises;
}

export const selectedExerciseId = {
  ...writable(null),
  select(exerciseId: Exercise["id"]) {
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

    let found = $exercises.find(
      (exercise) => exercise.id === $selectedExerciseId
    );

    set($exercises ? found : undefined);
  },
  undefined as Exercise
);

export default exercises;
