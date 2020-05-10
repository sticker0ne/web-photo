<template>
  <v-card
    class="mx-auto stream-player-card"
    :class="{
      fixed,
      'no-stream': !stream,
      'full-screen': fullScreen,
      'max-width': fullscreenSizeClass === 'max-width',
      'max-height': fullscreenSizeClass === 'max-height'
    }"
  >
    <div class="video-wrapper" @click.prevent.stop="$emit('click')">
      <video
        ref="localStreamPlayer"
        autoplay
        playsinline
        :muted="muted"
        @click.prevent.stop="$emit('click')"
      />
    </div>

    <div v-if="showPlaceholder" class="video-placeholder">
      <img class="person-icon" src="icons/person-black-18dp.svg" />
      <div class="break" />
      <div class="placeholder-text">{{ placeholderText }}</div>
    </div>
    <switch-camera v-if="showCameraSwitchButton && showSwitchCamera" />
    <v-card-actions v-if="!hideActions">
      <v-btn color="orange" text @click="takePhoto">
        Сделать фотографию
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SwitchCamera from '@/components/SwitchCamera'
export default {
  name: 'StreamPlayer',
  components: { SwitchCamera },
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
    placeholderText: {
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
    },
    showCameraSwitchButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPlaceholder: true,
      showSwitchCamera: false,
      windowWidth: 0,
      windowHeight: 0,
      streamSettings: null,
      setStreamSettingsInterval: null
    }
  },
  computed: {
    fullscreenSizeClass() {
      const { windowWidth, windowHeight, streamSettings } = this
      if (!(windowHeight && windowWidth && streamSettings)) return 'max-width'
      const trackRatio = streamSettings.aspectRatio
      const windowRatio = windowWidth / windowHeight

      return windowRatio > trackRatio ? 'max-height' : 'max-width'
    }
  },
  watch: {
    stream(value) {
      this.applySettingsByStream(value)
      this.$refs.localStreamPlayer.srcObject = value
      this.runStreamSettingsInterval()
    }
  },
  mounted() {
    this.$refs.localStreamPlayer.srcObject = this.stream
    this.applySettingsByStream(this.stream)
    this.runStreamSettingsInterval()
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    runStreamSettingsInterval() {
      this.setStreamSettingsInterval = setInterval(() => {
        this.setStreamSettings()
      }, 10)
    },
    setStreamSettings() {
      const videoTrack = this.stream?.getVideoTracks().length
        ? this.stream?.getVideoTracks()[0]
        : null
      this.streamSettings = videoTrack ? videoTrack.getSettings() : null
      if (this.streamSettings?.aspectRatio || !this.stream)
        clearInterval(this.setStreamSettingsInterval)
    },
    onWindowResize() {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    takePhoto() {
      this.dataChannel.send('TAKE_PHOTO')
    },
    applySettingsByStream(stream) {
      if (stream)
        setTimeout(() => {
          this.showPlaceholder = false
          this.showSwitchCamera = true
        }, 300)
      else this.showPlaceholder = true
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
  background-color: #343334;
  border-radius: 5px !important;

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
  .video-wrapper {
    z-index: 90;
    position: fixed;
    top: 0;
    left: 0;
    border-radius: 0 !important;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  video {
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

  &.max-width {
    video {
      width: 100%;
      height: auto;
    }
  }

  &.max-height {
    video {
      width: auto;
      height: 100%;
    }
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
