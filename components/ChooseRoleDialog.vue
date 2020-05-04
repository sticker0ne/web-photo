<template>
  <v-dialog :value="socketId" max-width="500" persistent>
    <v-card>
      <v-card-title class="headline">Выбирите роль устройства</v-card-title>

      <v-card-actions>
        <v-btn x-large width="45%" @click="confirmDialog(ROLE_CAMERA)">
          <v-icon dark>mdi-camera</v-icon>
          Камера
        </v-btn>
        <v-btn
          x-large
          width="45%"
          class="ml-auto"
          @click="confirmDialog(ROLE_MONITOR)"
        >
          <v-icon dark>mdi-monitor</v-icon>
          Монитор
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { ROLE_CAMERA, ROLE_MONITOR } from '@/assets/javascript/constants'

export default {
  name: 'ChooseRoleDialog',
  data() {
    return {
      ROLE_CAMERA,
      ROLE_MONITOR
    }
  },
  computed: {
    ...mapState({ socketId: (state) => state.socket.socketId })
  },
  methods: {
    confirmDialog(role) {
      this.$emit('confirmDialog', role)
    }
  }
}
</script>

<style scoped lang="scss">
.v-card__text,
.v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
