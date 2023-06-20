import { writable, get } from "svelte/store";

export const scale = writable({ vertical: 1, horizontal: 1 });

export function scaleKeypoints(
  keypoints,
  { horizontal: horizontalScale, vertical: verticalScale } = get(scale)
) {
  if (!keypoints) return null;

  // don't fuck up original list please
  return [...keypoints].map((keypoint) => {
    return {
      ...keypoint,
      x: keypoint.x * horizontalScale,
      y: keypoint.y * verticalScale,
    };
  });
}
