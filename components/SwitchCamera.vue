<template>
  <v-btn color="grey" class="ma-2 white--text" @click="onSwitchCamera">
    <v-icon dark>mdi-plus</v-icon>
    Переключить камеру
  </v-btn></template
>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'SwitchCamera',
  methods: {
    ...mapActions({
      switchCamera: 'media/switchCamera',
      reCallPhotograph: 'photograph/reCallPhotograph'
    }),
    async onSwitchCamera() {
      await this.switchCamera()
      await this.reCallPhotograph(this.$peer)
    }
  }
}
</script>

<style scoped></style>
