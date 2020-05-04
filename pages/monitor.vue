<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player
        :stream="localStream"
        hide-actions
        muted
        fixed
        show-camera-switch-button
      />
      <stream-player
        v-for="peer in []"
        :key="peer.peerId"
        :stream="peer.remoteStream"
        :data-channel="peer.dataChannel"
        :peer-id="peer.peerId"
        hide-actions
        full-screen
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  name: 'Monitor',
  components: { StreamPlayer },
  computed: {
    ...mapState({ localStream: (state) => state.media.localStream })
  },
  async mounted() {
    await this.requestAndSetLocalStream({
      audio: true,
      video: true,
      facingMode: 'user'
    })
  },
  methods: {
    ...mapActions({
      requestAndSetLocalStream: 'media/requestAndSetLocalStream'
    })
  }
}
</script>

<style lang="scss">
.v-application--wrap {
  background-color: #343334;
}
</style>
