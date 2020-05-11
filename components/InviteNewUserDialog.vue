<template>
  <div class="invite-new-user-dialog-wrapper">
    <v-btn
      color="orange"
      class="ma-2 white--text"
      @click="openInviteDialog"
      outlined
    >
      <v-icon>mdi-account-multiple-plus</v-icon>
      <div class="ml-2">Invite model</div>
    </v-btn>
    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Send invite link</v-card-title>
        <v-text-field
          ref="linkTextArea"
          class="px-3"
          :value="link || inviteLink"
        />
        <div v-if="isSafari" class="red--text ml-4">
          Please use the chrome instead of safari for better quality
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="copyLinkToClipboard">
            Copy
          </v-btn>
          <v-btn color="red darken-1" text @click="closeInviteDialog">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'InviteNewUserDialog',
  props: {
    link: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showDialog: false,
      isSafari: false
    }
  },
  mounted() {
    const usrAgent = navigator.userAgent.toLowerCase()
    const isSafari = usrAgent.includes('safari') && !usrAgent.includes('chrome')
    this.isSafari = isSafari
  },
  computed: {
    ...mapState({
      localStream: (state) => state.media.localStream,
      photographToken: (state) => state.photographToken
    }),
    inviteLink() {
      return (
        process.env.INVITE_HOST +
        '/connect?photographToken=' +
        encodeURIComponent(this.photographToken) +
        (this.isSafari ? '&forceHD=true' : '')
      )
    }
  },
  methods: {
    ...mapActions({
      requestAndSetLocalStream: 'media/requestAndSetLocalStream'
    }),

    closeInviteDialog() {
      this.$metrika.hit('/closeInviteDialog')
      this.showDialog = false
    },
    async openInviteDialog() {
      if (!this.localStream)
        await this.requestAndSetLocalStream({
          audio: true,
          resolution: [1280, 720],
          facingMode: 'user'
        })
      if (!this.localStream) return
      this.showDialog = true
      this.$metrika.hit('/openInviteDialog')
    },
    copyLinkToClipboard() {
      this.selectText()
      document.execCommand('copy')
      this.$metrika.hit('/onCopyLink')
    },
    selectText() {
      this.$refs.linkTextArea.focus()
      this.$refs.linkTextArea.$el.querySelector('input').select()
    }
  }
}
</script>

<style scoped></style>
