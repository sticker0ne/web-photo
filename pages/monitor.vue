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
    this.photographStream = await callPeer(
      this.photographToken,
      new MediaStream()
    )
  }
}
</script>

<style scoped></style>
