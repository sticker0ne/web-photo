<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player
        :stream="localStream"
        hide-actions
        muted
        full-screen
        show-camera-switch-button
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  name: 'Camera',
  components: { StreamPlayer },
  computed: {
    ...mapState({ localStream: (state) => state.media.localStream }),
    ...mapGetters({ connections: 'webRTC/connections' })
  },
  async mounted() {
    await this.requestAndSetLocalStream({
      audio: false,
      video: true,
      facingMode: 'environment'
    })
    this.emitCallMe()
  },
  methods: {
    ...mapActions({
      requestAndSetLocalStream: 'media/requestAndSetLocalStream',
      emitCallMe: 'socket/emitCallMe'
    })
  }
}
</script>

<style lang="scss">
.v-application--wrap {
  background-color: #343334;
}
</style>
