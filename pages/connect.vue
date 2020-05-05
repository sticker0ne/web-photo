<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <choose-role-dialog @confirmDialog="chooseRole" />
    </v-flex>
  </v-layout>
</template>

<script>
import ChooseRoleDialog from '@/components/ChooseRoleDialog'
import { ROLE_CAMERA, ROLE_MONITOR } from '@/assets/javascript/constants'

const pathMapper = { [ROLE_MONITOR]: '/monitor', [ROLE_CAMERA]: '/camera' }
export default {
  name: 'Connect',
  components: { ChooseRoleDialog },
  methods: {
    chooseRole(role) {
      this.$router.push({
        path: pathMapper[role],
        query: { photographToken: this.$route.query.photographToken }
      })
    }
  }
}
</script>

<style scoped></style>
