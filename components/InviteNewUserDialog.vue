<template>
  <v-dialog v-model="show" max-width="500">
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
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'InviteNewUserDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true
    },
    link: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['rtcToken']),
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    inviteLink() {
      return process.env.INVITE_HOST + '/connect?photographId=' + this.rtcToken
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
    closeInviteDialog() {
      this.$emit('close')
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
