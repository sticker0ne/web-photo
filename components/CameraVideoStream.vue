<template>
  <div class="camera-video-stream">
    <div>LocalStream: {{ localStream }}</div>
    <video
      id="local"
      width="400px"
      height="300px"
      autoplay
      style="border: 3px solid green"
      ref="localMediaPlayer"
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
    <v-text-field v-model="peerId" />
    <v-btn @click="call">Call</v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { requestMedia } from '@/assets/javascript/utils/userMedia'
import { createPeer, callPeer } from '@/assets/javascript/utils/peers'

let localStream = null

export default {
  name: 'CameraVideoStream',
  data() {
    return {
      hostPeerID: '',
      peerId: ''
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
  computed: {
    ...mapState({ localStream: 'media/localStream' })
  },
  methods: {
    start() {
      createPeer(localStream).then((peerId) => {
        this.hostPeerID = peerId
      })
    },
    call() {
      const peerId = this.peerId
      callPeer(peerId, localStream).then((stream) => {
        document.getElementById('cameraStream').srcObject = stream
      })
    }
  },
  watch: {
    localStream(value) {
      console.log({ value })
    }
  }
}
</script>

<style scoped></style>
