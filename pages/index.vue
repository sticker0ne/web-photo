<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <camera-video-stream />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'
import CameraVideoStream from '@/components/CameraVideoStream'

export default {
  components: { CameraVideoStream },
  methods: {
    ...mapMutations(['setRole'])
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
  }
}
</script>
