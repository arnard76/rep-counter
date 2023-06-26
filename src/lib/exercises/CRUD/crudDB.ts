import { database } from "$lib/exercises/CRUD/firebase.js";
import { ref, set, onValue } from "firebase/database";
import exercises from "$lib/exercises/store.js";
import type { ExercisesData } from "$lib/exercises";
import type Exercise from "$lib/exercises";

function updateExerciseOnDB(exerciseId: string, updatedExercise: Exercise) {
  set(ref(database, exerciseId), updatedExercise);
}

function streamExercisesFromDB() {
  return onValue(ref(database), (snapshot) => {
    const exerciseData: ExercisesData = snapshot.val();
    console.log("exercises data:", exerciseData);
    exercises.syncWithDatabase(exerciseData);
  });
}

export { updateExerciseOnDB, streamExercisesFromDB };
