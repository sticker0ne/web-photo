<template>
  <v-app>
    <v-app-bar app color="blue" dark flat>
      <v-btn
        v-if="showInviteBtn"
        color="grey"
        class="ma-2 white--text"
        @click="openInviteDialog"
      >
        <v-icon dark>mdi-plus</v-icon>
        Пригласить пользователя
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <invite-new-user-dialog
          v-model="showInviteDialog"
          @close="closeInviteDialog"
        />
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import InviteNewUserDialog from '@/components/InviteNewUserDialog'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'
import {
  createPeer,
  setStreamOnPeerCall
} from '@/assets/javascript/utils/peers'
import { requestMedia } from '@/assets/javascript/utils/userMedia'

export default {
  components: { InviteNewUserDialog },
  data() {
    return {
      showInviteDialog: false
    }
  },
  computed: {
    ...mapState(['role', 'peerToken']),
    showInviteBtn() {
      return this.role === ROLE_PHOTOGRAPH && this.peerToken.length > 0
    }
  },
  methods: {
    ...mapMutations({
      setLocalStream: 'media/setLocalStream',
      setPeerToken: 'setPeerToken'
    }),
    async openInviteDialog() {
      try {
        const stream = await requestMedia()
        this.setLocalStream(stream)
        setStreamOnPeerCall(stream)
        this.showInviteDialog = true
      } catch (err) {
        console.error(err) // TODO show error dialog
      }
    },
    closeInviteDialog() {
      this.showInviteDialog = false
    }
  },
  async mounted() {
    const peerWithId = await createPeer()
    this.setPeerToken(peerWithId.peerToken)
  }
}
</script>
