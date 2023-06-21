import { database } from "$lib/key-rep-area/CRUD/firebase.js";
import { ref, set, onValue } from "firebase/database";
import keyRepAreasStore from "$lib/key-rep-area/keyRepAreas.js";

function updateKRAsOnDB({ exerciseKeyRepAreas }) {
  set(ref(database, "0/exerciseKeyRepAreas"), exerciseKeyRepAreas);
}

function streamKRAsFromDB() {
  return onValue(ref(database, "0"), (snapshot) => {
    const data = snapshot.val();
    console.log("from db:", data);
    keyRepAreasStore.syncWithDatabase(data);
  });
}

export { updateKRAsOnDB, streamKRAsFromDB };
