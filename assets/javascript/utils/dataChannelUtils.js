import { OK, TAKE_PHOTO } from '@/assets/javascript/constants'

let _localStream = null
export function setLocalStream(localStream) {
  _localStream = localStream
}
export function getLocalStream() {
  return _localStream
}

export async function onDataChannelMessage(dataChannelEvent, peerId) {
  console.log(
    `data channel recived from peer ${peerId} message: `,
    dataChannelEvent
  )

  if (dataChannelEvent.data === TAKE_PHOTO) {
    const imageCapture = new ImageCapture(_localStream.getVideoTracks()[0])
    const blob = await imageCapture.takePhoto()
    console.log(blob)
    debugger
    dataChannelEvent.target.send(OK)
  }
}
