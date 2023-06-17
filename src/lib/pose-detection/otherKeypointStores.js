import { derived } from "svelte/store";
import { paused, pausedKeypoints } from "$lib/paused";
import keypoints from "$lib/pose-detection/keypoints.js";
import kRAsStore from "$lib/key-rep-area/keyRepAreas.js";

const controlledKeypoints = derived(
  [paused, pausedKeypoints, keypoints],
  ([$paused, $pausedKeypoints, $keypoints], set) => {
    set($paused ? $pausedKeypoints : $keypoints);
  }
);

const focusLimbNames = derived(
  [kRAsStore],
  ([$kRAsStore], set) => {
    if (!$kRAsStore) return [];

    let focusLimbNames = [];
    for (let [focusLimbName, _] of Object.entries($kRAsStore.keyRepAreas)) {
      focusLimbNames.push(focusLimbName);
    }

    set(focusLimbNames);
  },
  []
);

const focusLimbKeypoints = derived(
  [focusLimbNames, controlledKeypoints],
  ([$focusLimbNames, $controlledKeypoints], set) => {
    if (!$focusLimbNames || !$controlledKeypoints) return [];

    let focusLimbKeypoints = [];
    for (let keypoint of $controlledKeypoints) {
      if ($focusLimbNames.includes(keypoint.name)) {
        focusLimbKeypoints.push(keypoint);
      }
    }
    set(focusLimbKeypoints);
  },
  []
);

const relativeToKeypointNames = derived(
  [kRAsStore],
  ([$kRAsStore], set) => {
    if (!$kRAsStore) return [];

    let relativeToKeypointNames = [];
    for (let [_, keyRepAreas] of Object.entries($kRAsStore.keyRepAreas)) {
      for (let keyRepArea of keyRepAreas) {
        relativeToKeypointNames.push(keyRepArea.relativeToWhichKeypoint);
      }
    }

    set(relativeToKeypointNames);
  },
  []
);

const relativeToKeypoints = derived(
  [relativeToKeypointNames, controlledKeypoints],
  ([$relativeToKeypointNames, $controlledKeypoints], set) => {
    if (!$relativeToKeypointNames || !$controlledKeypoints) return [];

    let relativeToKeypoints = [];
    for (let keypoint of $controlledKeypoints) {
      if ($relativeToKeypointNames.includes(keypoint.name)) {
        relativeToKeypoints.push(keypoint);
      }
    }
    set(relativeToKeypoints);
  },
  []
);

export { controlledKeypoints, focusLimbKeypoints, relativeToKeypoints };