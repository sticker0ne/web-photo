<template>
  <div class="camera-video-stream">
    <video
      ref="localStreamPlayer"
      width="400px"
      height="300px"
      autoplay
      style="border: 3px solid green"
    />
  </div>
</template>

<script>
export default {
  name: 'StreamPlayer',
  props: {
    stream: {
      type: MediaStream,
      default: 0
    }
  },
  watch: {
    stream(value) {
      this.$refs.localStreamPlayer.srcObject = value
    }
  },
  mounted() {
    this.$refs.localStreamPlayer.srcObject = this.stream
  }
}
</script>

<style scoped></style>
