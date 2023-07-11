import { derived } from "svelte/store";
import { paused, pausedKeypoints } from "$lib/paused";
import keypoints from "$lib/pose-detection/keypoints";
import { selectedExercise } from "$lib/exercises/store";
import { scale, scaleKeypoints } from "$lib/pose-detection/scaleKeypoints";
import type { keypoint } from ".";

// reacts to pause changes 😀
const controlledKeypoints = derived(
  [paused, pausedKeypoints, keypoints],
  ([$paused, $pausedKeypoints, $keypoints], set) => {
    set($paused ? $pausedKeypoints : $keypoints);
  },
  undefined as keypoint[]
);

// reacts to pause & scale changes
const scaledControlledKeypoints = derived(
  [controlledKeypoints, scale],
  ([$controlledKeypoints, $scale], set) => {
    set(scaleKeypoints($controlledKeypoints, $scale));
  },
  undefined as keypoint[]
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
  [focusLimbNames, scaledControlledKeypoints],
  ([$focusLimbNames, $scaledControlledKeypoints], set) => {
    if (!$focusLimbNames || !$scaledControlledKeypoints) return;

    let focusLimbKeypoints = [];
    for (let keypoint of $scaledControlledKeypoints) {
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
  [relativeToKeypointNames, scaledControlledKeypoints],
  ([$relativeToKeypointNames, $scaledControlledKeypoints], set) => {
    if (!$relativeToKeypointNames || !$scaledControlledKeypoints) return null;

    let relativeToKeypoints = [];
    for (let keypoint of $scaledControlledKeypoints) {
      if ($relativeToKeypointNames.includes(keypoint.name)) {
        relativeToKeypoints.push(keypoint);
      }
    }
    set(relativeToKeypoints);
  },
  []
);

export {
  controlledKeypoints,
  scaledControlledKeypoints,
  focusLimbKeypoints,
  relativeToKeypoints,
};
