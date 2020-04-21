<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      {{ cameraStreams }}
      <stream-player :stream="localStream" />
      <stream-player
        v-for="cameraStream in cameraStreams"
        :key="cameraStream.peerId"
        :stream="cameraStream.stream"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'
import StreamPlayer from '@/components/StreamPlayer'
import { eventBus } from '@/assets/javascript/utils/eventBus'

export default {
  components: { StreamPlayer },
  data() {
    return {
      cameraStreams: []
    }
  },
  computed: {
    ...mapState({
      localStream: (state) => state.media.localStream,
      camerasConnections: (state) => state.camera.camerasConnections
    })
  },
  watch: {
    camerasConnections(value) {
      this.cameraStreams = value.map((cameraConnection) => {
        const stream = this.$peer.connections[cameraConnection.peerId][0]
          .remoteStream
        return { peerId: cameraConnection.peerId, stream }
      })
    }
  },
  methods: {
    ...mapMutations({ setRole: 'SET_ROLE' }),
    callMonitor({ peerId }) {
      this.$peer.call(peerId, this.localStream)
    }
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
    eventBus.$on('callMonitor', this.callMonitor)
  },
  beforeDestroy() {
    eventBus.$off('callMonitor', this.callMonitor)
  }
}
</script>
