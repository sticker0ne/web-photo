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
import { mapState, mapMutations, mapActions } from 'vuex'
import InviteNewUserDialog from '@/components/InviteNewUserDialog'
import { PATH_ROLE_MAP, ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'
import { eventBus } from '@/assets/javascript/utils/eventBus'

export default {
  components: { InviteNewUserDialog },
  data() {
    return {
      showInviteDialog: false,
      loaderText: 'Connecting...'
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
    this.setPhotographTokenFromRoute()
    this.setRoleFromRoute()
    eventBus.$on('saveToDisk', () => {
      this.$metrika.hit('/saveToDisk')
    })
  },
  methods: {
    ...mapMutations({
      setPhotographToken: 'SET_PHOTOGRAPH_TOKEN',
      setResolution: 'media/SET_RESOLUTION'
    }),
    ...mapActions({ setRole: 'setRole' }),

    setPhotographTokenFromRoute() {
      if (
        !this.photographToken?.length &&
        this.$route.query.photographToken?.length
      )
        this.setPhotographToken(this.$route.query.photographToken)
    },
    setRoleFromRoute() {
      const path = this.$route.path
      const role = PATH_ROLE_MAP[path]

      if (!role || this.role.length) return
      this.setRole(role)
    },
    setResolutionFromRoute() {
      if (this.$route.query.forceHD?.length) this.setResolution([1280, 720])
    }
  },
  watch: {
    $route() {
      this.setPhotographTokenFromRoute()
      this.setRoleFromRoute()
      this.setResolutionFromRoute()
    }
  }
}
</script>
