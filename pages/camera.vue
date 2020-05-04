<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player :stream="localStream" hide-actions muted full-screen />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import StreamPlayer from '@/components/StreamPlayer'
export default {
  name: 'Camera',
  components: { StreamPlayer },
  computed: {
    ...mapState({
      photographToken: (state) => state.photograph.photographToken,
      localStream: (state) => state.media.localStream
    })
  },
  async mounted() {
    await this.requestAndSetLocalStream({
      audio: false,
      video: true,
      facingMode: 'environment'
    })
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

<style lang="scss">
.v-application--wrap {
  background-color: #343334;
}
</style>
