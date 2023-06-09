import { derived, get, readable } from "svelte/store";
import { videoEl } from "$lib/video/getUserVideo.js";
import { getPose } from "$lib/pose-detection/detector.js";
import { paused, pausedKeypoints } from "$lib/paused";
import kRAsStore from "$lib/key-rep-area/keyRepAreas.js";

const keypoints = readable(null, (set) => {
  const snapAndDetect = setInterval(() => {
    let $videoEl = get(videoEl);
    if (!$videoEl || $videoEl.paused || !$videoEl.srcObject) return;
    getPose($videoEl).then((res) => {
      if (!res || !res.length) return;

      set(res[0].keypoints);
    });
  }, 100);

  return () => clearInterval(snapAndDetect);
});

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
      // for (let keyRepArea of keyRepAreas) {
      focusLimbNames.push(focusLimbName);
      // }
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

export {
  keypoints,
  controlledKeypoints,
  focusLimbKeypoints,
  relativeToKeypoints,
};
