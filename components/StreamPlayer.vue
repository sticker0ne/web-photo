<template>
  <v-card class="mx-auto">
    <v-card-title>{{ label }}</v-card-title>
    <video ref="localStreamPlayer" width="400px" height="300px" autoplay />
    <v-card-actions v-if="!hideActions">
      <v-btn color="orange" text @click="takePhoto">
        Сделать фотографию
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'StreamPlayer',
  props: {
    stream: {
      type: MediaStream,
      default: 0
    },
    peerId: {
      type: String,
      default: ''
    },
    dataChannel: {
      type: RTCDataChannel,
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    hideActions: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    stream(value) {
      this.$refs.localStreamPlayer.srcObject = value
    }
  },
  mounted() {
    this.$refs.localStreamPlayer.srcObject = this.stream
  },
  methods: {
    takePhoto() {
      this.dataChannel.send('TAKE_PHOTO')
    }
  }
}
</script>

<style scoped></style>
