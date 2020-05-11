<template>
  <div class="switch-camera" @click="onSwitchCamera">
    <img src="icons/flip_camera_ios-24px.svg" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'SwitchCamera',
  methods: {
    ...mapActions({
      switchCamera: 'media/switchCamera'
    }),
    async onSwitchCamera() {
      await this.switchCamera()
    }
  }
}
</script>

<style scoped lang="scss">
$imageWidth: 50px;

.switch-camera {
  height: $imageWidth;
  z-index: 110;
  cursor: pointer;
  position: fixed;
  bottom: 5px;
  left: calc(50% - #{$imageWidth}/ 2);

  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.45);

  img {
    width: $imageWidth;
  }
}
</style>
