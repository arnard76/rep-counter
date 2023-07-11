function captureVideo(videoEl, canvasEl = null) {
  if (!canvasEl) {
    canvasEl = document.createElement("canvas");
  }
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  var canvasContext = canvasEl.getContext("2d");
  canvasContext.drawImage(videoEl, 0, 0);
  return canvasEl.toDataURL("image/png");
}

export { captureVideo };
