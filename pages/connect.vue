<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <choose-role-dialog
        v-if="!this.role.length"
        @confirmDialog="chooseRole"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ChooseRoleDialog from '@/components/ChooseRoleDialog'
import { ROLE_CAMERA, ROLE_MONITOR } from '@/assets/javascript/constants'

const pathMapper = { [ROLE_MONITOR]: '/monitor', [ROLE_CAMERA]: '/camera' }
export default {
  name: 'Connect',
  components: { ChooseRoleDialog },
  methods: {
    ...mapMutations(['setRole', 'setPhotographToken']),
    chooseRole(role) {
      this.setRole(role)
      this.$router.push(pathMapper[role])
    }
  },
  computed: {
    ...mapState(['role'])
  },
  mounted() {
    this.setPhotographToken(this.$route.query.photographToken)
  }
}
</script>

<style scoped></style>
