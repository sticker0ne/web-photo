<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6> </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'

export default {
  components: {},
  methods: {
    ...mapMutations(['setRole'])
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
  }
}
</script>
