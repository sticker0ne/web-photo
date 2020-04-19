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
  methods: {
    ...mapMutations({ setRole: 'SET_ROLE' })
  },
  computed: {
    ...mapState({
      localStream: (state) => state.media.localStream,
      cameraPeerIds: (state) => state.camera.cameraPeerIds
    })
  },
  watch: {
    cameraPeerIds(value) {
      setTimeout(() => {
        this.cameraStreams = value.map((cameraPeerId) => {
          const stream = this.$peer.connections[cameraPeerId][0].remoteStream
          return { peerId: cameraPeerId, stream }
        })
      }, 500)
    }
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
    eventBus.$on('callMonitor', ({ peer }) => {
      debugger
      this.$peer.call(peer, this.localStream)
    })
  },
  beforeDestroy() {
    eventBus.$off('callMonitor')
  }
}
</script>
