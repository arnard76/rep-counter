import { writable, get, derived } from "svelte/store";
import type Exercise from "$legacy-pages-lib/exercises";
import type { Exercises, ExercisesData } from "$legacy-pages-lib/exercises";
import KeyRepArea from "$legacy-pages-lib/key-rep-area/keyRepArea";
import { streamExercises } from "$legacy-pages-lib/exercises/CRUD/crudDB";
import { browser } from "$app/environment";

const exercises = createExercisesStore();

function createExercisesStore() {
  const store = writable(null as Exercises, () => {
    console.log("subscribed to exercises");
    let stopReadingDatabase = browser ? streamExercises() : () => {};

    return () => {
      console.log("no more subscribers for exercises");
      stopReadingDatabase();
    };
  });

  return {
    subscribe: store.subscribe,
    set: store.set,

    syncWithDatabase(updatedExercisesData: ExercisesData) {
      store.set(createKRAInstancesFromKRAObjects(updatedExercisesData));
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

    for (const [limbName, focusLimb] of Object.entries(
      exerciseData.focusLimbs || {}
    )) {
      exercise.focusLimbs[limbName] = {
        ...focusLimb,
        keyRepAreas: focusLimb.keyRepAreas.map(
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
    this.set(exerciseId);
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
