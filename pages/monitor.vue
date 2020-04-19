<template>
  <div>
    Monitor's page
    <stream-player :stream="photographStream" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { callPeer } from '@/assets/javascript/utils/peers'
import StreamPlayer from '@/components/StreamPlayer'
import { requestMedia } from '@/assets/javascript/utils/userMedia'

export default {
  name: 'Monitor',
  components: { StreamPlayer },
  data() {
    return {
      photographStream: null
    }
  },
  computed: {
    ...mapState({
      photographToken: (state) => state.photographToken
    })
  },
  async mounted() {
    const stream = await requestMedia()
    this.photographStream = await callPeer(this.photographToken, stream)
  }
}
</script>

<style scoped></style>
