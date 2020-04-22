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
  computed: {
    ...mapState({
      photographToken: (state) => state.photograph.photographToken,
      camerasConnections: (state) => state.camera.camerasConnections
    })
  },
  watch: {
    camerasConnections(value) {
      this.cameraStreams = value.map((cameraConnection) => {
        const stream = this.$peer.connections[cameraConnection.peerId][1]
          .remoteStream
        return { peerId: cameraConnection.peerId, stream }
      })
    }
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
