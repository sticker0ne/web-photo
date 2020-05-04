<template>
  <v-card
    class="mx-auto stream-player-card"
    :class="{ fixed, 'no-stream': !stream, 'full-screen': fullScreen }"
  >
    <v-card-title v-if="label.length">{{ label }}</v-card-title>
    <video
      ref="localStreamPlayer"
      autoplay
      playsinline
      :muted="muted"
      @click.prevent.stop
      @touchstart.prevent.stop
    />
    <div v-if="showPlaceholder" class="video-placeholder">
      <img class="person-icon" src="~/static/icons/person-black-18dp.svg" />
      <div class="break" />
      <div class="placeholder-text">You</div>
    </div>
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
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPlaceholder: true
    }
  },
  watch: {
    stream(value) {
      if (value)
        setTimeout(() => {
          this.showPlaceholder = false
        }, 300)
      else this.showPlaceholder = true

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
.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 10px;

  img {
    height: 70%;
  }

  .break {
    flex-basis: 100%;
    height: 0;
  }

  .placeholder-text {
    color: white;
  }
}

.full-screen {
  video {
    z-index: 90;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    border-radius: 0 !important;
  }

  .video-placeholder {
    z-index: 80;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    border-radius: 0 !important;
  }
}

.fixed {
  z-index: 100;
  position: fixed;
  right: 10px;
  bottom: 10px;
  padding: 0;

  &.stream-player-card {
    box-shadow: none;
  }

  video {
    max-height: 300px;
    height: max(18vh, 18vw);
  }

  &.no-stream {
    video {
      max-width: 400px;
    }
  }
}
</style>
