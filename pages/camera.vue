<template>
  <div>Camera's page</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Camera',
  computed: {
    ...mapState({
      photographToken: (state) => state.photograph.photographToken,
      localStream: (state) => state.media.localStream
    })
  },
  async mounted() {
    await this.requestAndSetLocalStream({ audio: false, video: true })
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
