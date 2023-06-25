import { derived } from "svelte/store";
import { paused, pausedKeypoints } from "$lib/paused";
import keypoints from "$lib/pose-detection/keypoints.js";
import { selectedExercise } from "$lib/exercises/selected";
import { scale, scaleKeypoints } from "$lib/pose-detection/scaleKeypoints.js";

// reacts to scale & pause changes 😀
const controlledKeypoints = derived(
  [paused, pausedKeypoints, keypoints, scale],
  ([$paused, $pausedKeypoints, $keypoints, $scale], set) => {
    set(scaleKeypoints($paused ? $pausedKeypoints : $keypoints, $scale));
  },
  undefined as any[]
);

const focusLimbNames = derived(
  selectedExercise,
  ($selectedExercise, set) => {
    if (!$selectedExercise) return;

    let focusLimbNames = [];
    for (let [focusLimbName, _] of Object.entries(
      $selectedExercise.focusLimbs
    )) {
      focusLimbNames.push(focusLimbName);
    }

    set(focusLimbNames);
  },
  []
);

const focusLimbKeypoints = derived(
  [focusLimbNames, controlledKeypoints],
  ([$focusLimbNames, $controlledKeypoints], set) => {
    if (!$focusLimbNames || !$controlledKeypoints) return;

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
  [selectedExercise],
  ([$selectedExercise], set) => {
    if (!$selectedExercise) return;

    let relativeToKeypointNames = [];
    for (let [_, { keyRepAreas }] of Object.entries(
      $selectedExercise.focusLimbs
    )) {
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
    if (!$relativeToKeypointNames || !$controlledKeypoints) return null;

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
