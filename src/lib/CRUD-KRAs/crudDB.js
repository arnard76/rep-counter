import { database } from "$lib/CRUD-KRAs/firebase.js";
import { ref, set, onValue } from "firebase/database";
import keyRepAreasStore from "$lib/CRUD-KRAs/keyRepAreas.js";

function updateKRAsOnDB({ keyRepAreas: updatedKRAs }) {
  set(ref(database, "0/keyRepAreas"), updatedKRAs);
}

function streamKRAsFromDB() {
  return onValue(ref(database, "0"), (snapshot) => {
    const data = snapshot.val();
    console.log("from db:", data);
    keyRepAreasStore.syncWithDatabase(data);
  });
}

export { updateKRAsOnDB, streamKRAsFromDB };
