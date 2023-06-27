import { get, readable } from "svelte/store";
import videoEl from "$lib/video/video";
import { getPose } from "$lib/pose-detection/detector.js";

// doesn't react to scale changes (use controlledKeypoints instead)
const keypoints = readable(null, (set) => {
  const snapAndDetect = setInterval(() => {
    let $videoEl = get(videoEl);

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState#value
    if (!$videoEl || $videoEl.paused || $videoEl.readyState < 4) return;

    getPose($videoEl).then((res) => {
      if (!res || !res.length) return;

      set(res[0].keypoints);
    });
  }, 100);

  return () => clearInterval(snapAndDetect);
});

export default keypoints;
