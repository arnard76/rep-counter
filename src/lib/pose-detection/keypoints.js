import { derived, get, readable, writable } from "svelte/store";
import { getPose } from "$lib/pose-detection/detector.js";

export const videoEl = writable(null);

export const keypoints = readable(null, (set) => {
  const snapAndDetect = setInterval(() => {
    if (!get(videoEl)) return;

    getPose(get(videoEl)).then((res) => {
      if (!res || !res.length) return;

      set(res[0].keypoints);
    });
  }, 100);

  return () => clearInterval(snapAndDetect);
});

export const paused = {
  ...writable(false),
  toggle() {
    this.update((currentlyPaused) => (currentlyPaused = !currentlyPaused));
  },
};

export const pausedKeypoints = derived(paused, ($paused, set) => {
  set($paused ? get(pausedKeypoints) : null);
});
