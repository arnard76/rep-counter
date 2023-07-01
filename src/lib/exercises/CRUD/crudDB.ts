import { database } from "$lib/exercises/CRUD/firebase.js";
import { ref, set, onValue, push } from "firebase/database";
import exercises from "$lib/exercises/store.js";
import type { ExercisesData, ExerciseData } from "$lib/exercises";

function updateExercise(updatedExercise: ExerciseData) {
  set(ref(database, updatedExercise.id), updatedExercise);
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
