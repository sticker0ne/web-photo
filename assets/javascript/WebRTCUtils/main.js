import { log } from './log.js'
import { requestMedia } from './request-media.js'
import { PeerConnection } from './peer-connection.js'

const parseRTCSession = (session) => {
  return new RTCSessionDescription(JSON.parse(session))
}

const click = (id, handler) =>
  document.getElementById(id).addEventListener('click', handler)

const localVideo = document.getElementById('local')
const remoteVideo = document.getElementById('remote')
const textarea = document.getElementById('buffer')

const STUN = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
]

const pc = new PeerConnection({ iceServers: STUN })

pc.addEventListener('stream', (event) => (remoteVideo.srcObject = event.stream))
pc.addEventListener(
  'offer',
  (event) => (textarea.value = JSON.stringify(event.offer))
)

click('createOffer', () => pc.createOffer())
click('offer', () => pc.setOffer(parseRTCSession(textarea.value)))
click('answer', () => pc.setAnswer(parseRTCSession(textarea.value)))

const main = async () => {
  try {
    const stream = await requestMedia()
    localVideo.srcObject = stream
    pc.addStream(stream)
  } catch (err) {
    console.error('Error: ', err)
    log(err)
  }
}

main()
