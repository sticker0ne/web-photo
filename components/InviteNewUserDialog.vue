<template>
  <div class="invite-new-user-dialog-wrapper">
    <v-btn color="grey" class="ma-2 white--text" @click="openInviteDialog">
      <v-icon dark>mdi-plus</v-icon>
      Пригласить пользователя
    </v-btn>
    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Ссылка</v-card-title>
        <v-text-field
          ref="linkTextArea"
          class="px-3"
          :value="link || inviteLink"
        />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="copyLinkToClipboard">
            Копировать
          </v-btn>
          <v-btn color="red darken-1" text @click="closeInviteDialog">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { requestMedia } from '@/assets/javascript/utils/userMedia'
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
      showDialog: false
    }
  },
  computed: {
    ...mapState({
      localStream: (state) => state.media.localStream,
      peerId: (state) => state.peer.peerId
    }),
    inviteLink() {
      return process.env.INVITE_HOST + '/connect?photographToken=' + this.peerId
    }
  },
  watch: {
    show(value) {
      if (value) {
        setTimeout(() => {
          this.selectText()
        }, 20)
      }
    }
  },
  methods: {
    ...mapMutations({ setLocalStream: 'media/SET_LOCAL_STREAM' }),

    async requestAndSetLocalStream() {
      const stream = await requestMedia()
      if (!stream) return false
      this.setLocalStream(stream)
      return true
    },
    closeInviteDialog() {
      this.showDialog = false
    },
    async openInviteDialog() {
      if (!this.localStream)
        await this.requestAndSetLocalStream({ audio: true, video: true })
      if (!this.localStream) return
      this.showDialog = true
    },
    copyLinkToClipboard() {
      this.selectText()
      document.execCommand('copy')
    },
    selectText() {
      this.$refs.linkTextArea.focus()
      this.$refs.linkTextArea.$el.querySelector('input').select()
    }
  }
}
</script>

<style scoped></style>
