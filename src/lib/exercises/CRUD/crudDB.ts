import { database } from "$lib/exercises/CRUD/firebase.js";
import { ref, set, onValue, push, remove } from "firebase/database";
import exercises from "$lib/exercises/store.js";
import type { ExercisesData, ExerciseData } from "$lib/exercises";

function updateExercise(exerciseId: string, updatedExercise: ExerciseData) {
  set(ref(database, `production-db/${exerciseId}`), updatedExercise);
}

function createExercise(exercise: ExerciseData) {
  push(ref(database, `production-db/`), exercise);
}

function duplicateExercise(exercise: ExerciseData) {
  if (!exercise) return;
  push(ref(database, `production-db/`), exercise);
}

function deleteExercise(exerciseId: string) {
  if (!exerciseId) return;

  remove(ref(database, `production-db/${exerciseId}`));
}

function streamExercises() {
  return onValue(ref(database, `production-db/`), (snapshot) => {
    const exerciseData: ExercisesData = snapshot.val();
    console.log("exercises data:", exerciseData);
    exercises.syncWithDatabase(exerciseData);
  });
}

export {
  streamExercises,
  createExercise,
  duplicateExercise,
  updateExercise,
  deleteExercise,
};
