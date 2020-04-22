<template>
  <div>
    Monitor's page
    <stream-player
      v-for="cameraConnection in camerasConnections"
      :key="cameraConnection.peerId"
      :stream="$peer.connections[cameraConnection.peerId][0].remoteStream"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  name: 'Monitor',
  components: { StreamPlayer },
  computed: {
    ...mapState({
      photographToken: (state) => state.photograph.photographToken,
      camerasConnections: (state) => state.camera.camerasConnections
    })
  },
  async mounted() {
    await this.requestAndSetLocalStream({ audio: true, video: true })
    this.callPhotograph(this.$peer)
  },
  methods: {
    ...mapActions({
      requestAndSetLocalStream: 'media/requestAndSetLocalStream',
      callPhotograph: 'photograph/callPhotograph'
    })
  }
}
</script>

<style scoped></style>
