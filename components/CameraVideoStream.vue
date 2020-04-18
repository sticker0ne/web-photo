<template>
  <div class="camera-video-stream">
    <video
      id="local"
      width="400px"
      height="300px"
      autoplay
      style="border: 3px solid green"
    />
    <video
      id="cameraStream"
      width="400px"
      height="300px"
      autoplay
      style="border: 3px solid red"
    />

    <v-text-field v-model="hostPeerID" readonly />
    <v-btn @click="start">Start</v-btn>
    <br />
    <v-text-field v-model="peerID" />
    <v-btn @click="call">Call</v-btn>
  </div>
</template>

<script>
import Peer from 'peerjs'

import { requestMedia } from '@/assets/javascript/utils/userMedia'

let localStream = null

const createPeer = () => {
  return new Promise((resolve, reject) => {
    const peer = new Peer({})
    peer.on('open', resolve)
    peer.on('call', (call) => {
      call.answer(localStream)
    })
  })
}

export default {
  name: 'CameraVideoStream',
  data() {
    return {
      hostPeerID: '1',
      peerID: '2'
    }
  },
  mounted() {
    requestMedia()
      .then((mediaStream) => {
        document.getElementById('local').srcObject = mediaStream
        localStream = mediaStream
      })
      .catch((e) => console.error(e))
  },
  methods: {
    start() {
      createPeer().then((peerID) => {
        this.hostPeerID = peerID
      })
    },
    call() {
      const peerID = this.peerID
      const peer = new Peer({})
      const call = peer.call(peerID, localStream)

      return new Promise((resolve, reject) => {
        call.on('stream', (stream) => {
          document.getElementById('cameraStream').srcObject = stream
          resolve(call)
        })
      })
    }
  }
}
</script>

<style scoped></style>
