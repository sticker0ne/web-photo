<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <stream-player :stream="localStream" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  components: { StreamPlayer },
  methods: {
    ...mapMutations(['setRole'])
  },
  computed: {
    ...mapState({ localStream: (state) => state.media.localStream })
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
  }
}
</script>
