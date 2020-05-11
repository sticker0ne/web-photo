export const requestMedia = ({
  audio = false,
  resolution = [1280, 720],
  facingMode = 'user'
} = {}) => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia

  const video = {
    width: { ideal: resolution[0] },
    height: { ideal: resolution[1] },
    frameRate: {
      ideal: 30
    },
    aspectRatio: 1.777777778,
    facingMode: {
      ideal: facingMode
    }
  }

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
