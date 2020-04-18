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
import { mapState } from 'vuex'
import InviteNewUserDialog from '@/components/InviteNewUserDialog'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'

export default {
  components: { InviteNewUserDialog },
  data() {
    return {
      showInviteDialog: false
    }
  },
  computed: {
    ...mapState(['role', 'rtcToken']),
    showInviteBtn() {
      return this.role === ROLE_PHOTOGRAPH && this.rtcToken.length > 0
    }
  },
  methods: {
    openInviteDialog() {
      this.showInviteDialog = true
    },
    closeInviteDialog() {
      this.showInviteDialog = false
    }
  }
}
</script>
