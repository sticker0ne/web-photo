<template>
  <div>
    Monitor's page
    <stream-player
      v-for="cameraStream in cameraStreams"
      :key="cameraStream.peerId"
      :stream="cameraStream.stream"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  name: 'Monitor',
  components: { StreamPlayer },
  data() {
    return {
      cameraStreams: []
    }
  },
  watch: {
    cameraPeerIds(value) {
      setTimeout(() => {
        debugger
        this.cameraStreams = value.map((cameraPeerId) => {
          const stream = this.$peer.connections[cameraPeerId][1].remoteStream
          return { peerId: cameraPeerId, stream }
        })
      }, 500)
    }
  },
  computed: {
    ...mapState({
      photographToken: (state) => state.photographToken,
      cameraPeerIds: (state) => state.camera.cameraPeerIds
    })
  },
  mounted() {
    const connection = this.$peer.connect(this.photographToken)
    connection.on('open', () => {
      connection.send('monitor')
    })
  }
}
</script>

<style scoped></style>
