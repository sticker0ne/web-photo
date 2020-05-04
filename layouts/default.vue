<template>
  <v-app>
    <div>
      <invite-new-user-dialog v-if="roleIsPhotographAndPeerIsOpen" />
    </div>
    <v-content>
      <v-container>
        <v-overlay :value="!socketIsConnected" align="center" opacity="0.9">
          <v-progress-circular indeterminate size="64" />
          <v-card-text>{{ loaderText }}</v-card-text>
        </v-overlay>
        {{ videoInputs }}
        <nuxt v-if="socketIsConnected" />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import InviteNewUserDialog from '@/components/InviteNewUserDialog'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'

export default {
  components: { InviteNewUserDialog },
  data() {
    return {
      showInviteDialog: false,
      loaderText: 'Подключение к серверу...'
    }
  },
  computed: {
    ...mapState({
      socketId: (state) => state.socket.socketId,
      role: (state) => state.role,
      peerId: (state) => state.peer.peerId,
      photographToken: (state) => state.photograph.photographToken,
      videoInputs: (state) => state.media.videoInputs
    }),
    socketIsConnected() {
      return this.socketId.length
    },
    peerIsOpen() {
      return this.peerId.length > 0
    },
    roleIsPhotographAndPeerIsOpen() {
      return this.role === ROLE_PHOTOGRAPH && this.peerIsOpen
    }
  },
  mounted() {
    if (!this.photographToken?.length)
      this.setPhotographToken(this.$route.query.photographToken)
  },
  methods: {
    ...mapMutations({ setPhotographToken: 'photograph/SET_PHOTOGRAPH_TOKEN' })
  }
}
</script>
