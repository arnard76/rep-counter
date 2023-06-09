import { get, readable } from "svelte/store";
import { videoEl } from "$lib/video/getUserVideo.js";
import { getPose } from "$lib/pose-detection/detector.js";

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

export default keypoints;
