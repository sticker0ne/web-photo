<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player :stream="localStream" />
      <stream-player
        v-for="cameraConnection in camerasConnections"
        :key="cameraConnection.peerId"
        :stream="$peer.connections[cameraConnection.peerId][0].remoteStream"
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
  computed: {
    ...mapState({
      localStream: (state) => state.media.localStream,
      camerasConnections: (state) => state.camera.camerasConnections
    })
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
