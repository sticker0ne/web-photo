export const requestMedia = ({ audio = false, video = true } = {}) => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia

  video = video
    ? {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: {
          ideal: 30
        },
        aspectRatio: 1.777777778
      }
    : video

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
