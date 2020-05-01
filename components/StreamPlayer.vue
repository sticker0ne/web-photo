<template>
  <v-card class="mx-auto" :class="{ fixed }">
    <v-card-title v-if="label.length">{{ label }}</v-card-title>
    <video ref="localStreamPlayer" autoplay playsinline :muted="muted" />
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
    },
    muted: {
      type: Boolean,
      default: false
    },
    fixed: {
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

<style scoped lang="scss">
.fixed {
  position: fixed;
  right: 10px;
  bottom: 10px;
  padding: 0;

  video {
    max-height: 300px;
    height: max(18vh, 18vw);
  }
}
</style>
