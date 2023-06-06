import { writable, derived, get } from "svelte/store";
import { videoEl } from "$lib/video/getUserVideo.js";
import { keypoints } from "$lib/pose-detection/keypoints.js";

export const paused = {
  ...writable(false),
  toggle() {
    this.update((currentlyPaused) => {
      let $videoEl = get(videoEl);
      if ($videoEl && $videoEl.srcObject) {
        currentlyPaused ? $videoEl.play() : $videoEl.pause();
        currentlyPaused = !currentlyPaused;
      }
      return currentlyPaused;
    });
  },
};

export const pausedKeypoints = derived(paused, ($paused, set) => {
  set($paused ? get(keypoints) : null);
});
