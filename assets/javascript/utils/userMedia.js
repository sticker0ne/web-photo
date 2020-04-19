export const requestMedia = ({ audio = false, video = true } = {}) => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia

  const constraints = {
    audio,
    video
  }

  try {
    return navigator.getUserMedia
      ? new Promise((resolve, reject) =>
          navigator.getUserMedia(constraints, resolve, reject)
        )
      : navigator.mediaDevices.getUserMedia(constraints)
  } catch (e) {
    return Promise.reject(new Error(e))
  }
}
