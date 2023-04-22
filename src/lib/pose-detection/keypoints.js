import { get, readable, writable } from "svelte/store";
import { getPose } from "$lib/pose-detection/detector.js";

export const videoEl = writable(null);

export const keypoints = readable(null, (set) => {
  const snapAndDetect = setInterval(() => {
    if (!get(videoEl)) return;

    getPose(get(videoEl)).then((res) => {
      if (!res || !res.length) return;

      console.log(res);
      set(res[0].keypoints);
    });
  }, 100);

  return () => clearInterval(snapAndDetect);
});
