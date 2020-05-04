<template>
  <v-app>
    <div>
      <invite-new-user-dialog v-if="roleIsPhotograph" />
    </div>
    <v-content>
      <v-container>
        <v-overlay :value="!socketIsConnected" align="center" opacity="0.9">
          <v-progress-circular indeterminate size="64" />
          <v-card-text>{{ loaderText }}</v-card-text>
        </v-overlay>
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
      photographToken: (state) => state.photographToken
    }),
    socketIsConnected() {
      return this.socketId.length
    },
    roleIsPhotograph() {
      return this.role === ROLE_PHOTOGRAPH
    }
  },
  mounted() {
    if (
      !this.photographToken?.length &&
      this.$route.query.photographToken?.length
    )
      this.setPhotographToken(this.$route.query.photographToken)
  },
  methods: {
    ...mapMutations({ setPhotographToken: 'SET_PHOTOGRAPH_TOKEN' })
  }
}
</script>
