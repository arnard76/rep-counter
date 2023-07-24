import { get } from "svelte/store";
import { browser } from "$app/environment";
import videoEl from "./video";

export let loading = false;

export default function getLiveVideo() {
  if (browser) {
    loading = true;
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream: MediaStream) => {
        videoEl.update(($videoEl) => {
          if ($videoEl) $videoEl.srcObject = stream;
          return $videoEl;
        });
        get(videoEl)?.play();
        loading = false;
      })
      .catch((error: string) => {
        console.log(
          "oops! the camera is not accessible for some reason 🥲🥲",
          error
        );
        loading = false;
      });
  }
}

export function stopUsingUserMedia() {
  get(videoEl)
    ?.srcObject?.getTracks()
    .forEach((track: MediaStreamTrack) => track.stop());
}
