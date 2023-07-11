import { database } from "$legacy-pages-lib/exercises/CRUD/firebase.js";
import { ref, set, onValue, push } from "firebase/database";
import exercises from "$legacy-pages-lib/exercises/store.js";
import type { ExercisesData, ExerciseData } from "$legacy-pages-lib/exercises";

function updateExercise(exerciseId: string, updatedExercise: ExerciseData) {
  set(ref(database, exerciseId), updatedExercise);
}

function createExercise(exercise: ExerciseData) {
  push(ref(database), exercise);
}

function streamExercises() {
  return onValue(ref(database), (snapshot) => {
    const exerciseData: ExercisesData = snapshot.val();
    console.log("exercises data:", exerciseData);
    exercises.syncWithDatabase(exerciseData);
  });
}

export { streamExercises, createExercise, updateExercise };
