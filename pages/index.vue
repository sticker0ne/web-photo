<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player
        v-if="localStream"
        :stream="localStream"
        hide-actions
        muted
        fixed
        placeholder-text="Вы"
      />
      <stream-player
        v-for="connection in connections"
        :key="connection.id"
        :stream="connection.stream"
        :data-channel="connection.dataChannel"
        label="camera"
        placeholder-text="Модель"
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
    ...mapGetters({ connections: 'webRTC/connections' })
  },
  methods: {
    ...mapActions({ setRole: 'setRole' })
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
  }
}
</script>
