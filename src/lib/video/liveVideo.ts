import { get } from "svelte/store";
import { browser } from "$app/environment";
import videoEl from "./video";

export default function getLiveVideo() {
  if (browser) {
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream: any) => {
        videoEl.update(($videoEl) => {
          if ($videoEl) $videoEl.srcObject = stream;
          return $videoEl;
        });
        get(videoEl).play();
      })
      .catch((error: string) => {
        console.log(
          "oops! the camera is not accessible for some reason 🥲🥲",
          error
        );
      });
  }
}
