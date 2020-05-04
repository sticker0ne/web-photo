<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player :stream="localStream" hide-actions muted fixed />
      <stream-player
        v-for="peer in connectedPeers"
        :key="peer.peerId"
        :stream="peer.remoteStream"
        :data-channel="peer.dataChannel"
        :peer-id="peer.peerId"
        label="camera"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  components: { StreamPlayer },
  computed: {
    ...mapState({ localStream: (state) => state.media.localStream }),
    ...mapGetters({ connectedPeers: 'peer/getConnectedPeers' })
  },
  methods: {
    ...mapActions({ setRole: 'setRole' })
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
  }
}
</script>
