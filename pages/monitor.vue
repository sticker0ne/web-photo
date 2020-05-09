<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player
        :stream="localStream"
        hide-actions
        muted
        fixed
        show-camera-switch-button
        placeholder-text="Вы"
      />
      <stream-player
        v-for="connection in connections"
        :key="connection.id"
        :stream="connection.stream"
        :data-channel="connection.dataChannel"
        hide-actions
        full-screen
        placeholder-text="Фотограф"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  name: 'Monitor',
  components: { StreamPlayer },
  computed: {
    ...mapState({ localStream: (state) => state.media.localStream }),
    ...mapGetters({ connections: 'webRTC/connections' })
  },
  async mounted() {
    await this.requestAndSetLocalStream({
      audio: true,
      video: true,
      facingMode: 'user'
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
