export const requestMedia = () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia

  const constraints = {
    audio: false,
    video: true
  }

  try {
    return navigator.getUserMedia
      ? new Promise((resolve, reject) =>
          navigator.getUserMedia(constraints, resolve, reject)
        )
      : navigator.mediaDevices.getUserMedia(constraints)
  } catch (e) {
    return Promise.reject(
      new Error(
        `WebRTC navigator.getUserMedia() is not supported in your browser.`
      )
    )
  }
}
