import { derived, get, readable, writable } from "svelte/store";
import { getPose } from "$lib/pose-detection/detector.js";

export const videoEl = writable(null);

export const keypoints = readable(null, (set) => {
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

export const paused = {
  ...writable(false),
  toggle() {
    this.update((currentlyPaused) => {
      currentlyPaused ? get(videoEl).play() : get(videoEl).pause();
      currentlyPaused = !currentlyPaused;
      return currentlyPaused;
    });
  },
};

export const pausedKeypoints = derived(paused, ($paused, set) => {
  set($paused ? get(keypoints) : null);
});

export const controlledKeypoints = derived(
  [paused, pausedKeypoints, keypoints],
  ([$paused, $pausedKeypoints, $keypoints], set) => {
    set($paused ? $pausedKeypoints : $keypoints);
  }
);
