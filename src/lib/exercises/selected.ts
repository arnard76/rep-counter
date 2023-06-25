import { writable, get, derived } from "svelte/store";
import type Exercise from "$lib/exercises";
import exercises from "./store";

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
    console.log($exercises, found);
    set($exercises ? found : undefined);
  },
  undefined as Exercise
);
