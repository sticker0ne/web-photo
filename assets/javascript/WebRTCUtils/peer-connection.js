import { nanoid } from 'nanoid'
import { onDataChannelMessage } from '@/assets/javascript/utils/dataChannelUtils'

export class PeerConnection extends EventTarget {
  /**
   * @param {Object} config
   */
  constructor(config) {
    super()

    this.stream = null
    this.dataChannel = null

    this.id = nanoid()
    this._pc = new RTCPeerConnection(config)
    this.dataChannel = this._pc.createDataChannel('123')

    this._pc.ondatachannel = (event) => {
      this.dispatchEvent(new Event('ondatachannel'))
      event.channel.addEventListener('message', (event2) => {
        onDataChannelMessage(event2)
      })
    }

    this._pc.addEventListener('icecandidate', (event) =>
      this._onIceCandidate(event)
    )
    this._pc.addEventListener('track', (event) => this._onTrack(event))
    this._pc.onsignalingstatechange = (event) => {
      if (event.target.signalingState === 'stable') window.pc = event.target
    }
  }

  async createOffer() {
    const offer = await this._pc.createOffer()
    await this._pc.setLocalDescription(offer)
  }

  async setOffer(offer) {
    await this._pc.setRemoteDescription(offer)
    const answer = await this._pc.createAnswer()
    await this._pc.setLocalDescription(answer)
  }

  setAnswer(answer) {
    this._pc.setRemoteDescription(answer)
  }

  addStream(stream) {
    stream.getTracks().forEach((track) => this._pc.addTrack(track, stream))
  }

  _onTrack(event) {
    const publicEvent = new Event('stream')
    publicEvent.stream = event.streams[0]
    this.stream = event.streams[0]
    this.dispatchEvent(publicEvent)
  }

  _onIceCandidate(event) {
    if (event.candidate == null) {
      const event2 = new Event('offer')
      event2.offer = this._pc.localDescription
      this.dispatchEvent(event2)
    }
  }
}
