import { writable, get } from "svelte/store";
import { browser } from "$app/environment";

export const videoEl = writable(null);

export default function getUserVideo() {
  if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoEl.update(($videoEl) => {
          if ($videoEl) $videoEl.srcObject = stream;
          return $videoEl;
        });
        get(videoEl).play();
      })
      .catch((error) => {
        console.log(
          "oops! the camera is not accessible for some reason 🥲🥲",
          error
        );
      });
  }
}
