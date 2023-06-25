import { writable, get } from "svelte/store";
import KeyRepArea from "$lib/key-rep-area/keyRepArea";

const { subscribe, set } = writable(null);
const selectedKeyRepArea = {
  subscribe,
  select(KRA: KeyRepArea) {
    if (!(KRA instanceof KeyRepArea)) {
      console.error(
        `this key rep area (${KRA}) is not of type KeyRepArea. It is type ${typeof KRA}.`
      );
      return;
    }

    set(KRA === get(selectedKeyRepArea) ? null : KRA);
  },
};

export default selectedKeyRepArea;
