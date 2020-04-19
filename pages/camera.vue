<template>
  <div>Camera's page</div>
</template>

<script>
import { mapState } from 'vuex'
import { requestMedia } from '@/assets/javascript/utils/userMedia'
export default {
  name: 'Camera',
  computed: {
    ...mapState({ photographToken: (state) => state.photographToken })
  },
  async mounted() {
    const stream = await requestMedia({ audio: false, video: true })
    this.$peer.call(this.photographToken, stream)
  }
}
</script>

<style scoped></style>
