<template>
  <v-dialog :value="socketId" max-width="500" persistent>
    <v-card>
      <v-card-title class="headline">Choose role</v-card-title>
      <v-card-text>
        <div class="role-desc">
          <div class="role-desc-icon">
            <v-icon color="black">mdi-camera</v-icon>
          </div>
          <div class="role-desc-text">
            The photographer is able to see you, you are able to see yourself
          </div>
        </div>
        <div class="role-desc">
          <div class="role-desc-icon">
            <v-icon color="black">mdi-camera</v-icon>
            +
            <v-icon color="black">mdi-monitor</v-icon>
          </div>
          <div class="role-desc-text">
            The photographer is able to see and hear you, you are able to see
            and hear PH
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn x-large width="45%" @click="confirmDialog(ROLE_CAMERA)">
          <v-icon dark>mdi-camera</v-icon>
        </v-btn>
        <v-btn
          x-large
          width="45%"
          class="ml-auto"
          @click="confirmDialog(ROLE_MONITOR)"
        >
          <v-icon dark>mdi-camera</v-icon>
          +
          <v-icon dark>mdi-monitor</v-icon>
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

.role-desc {
  display: flex;
  align-items: center;

  &:last-child {
    margin-top: 12px;
  }

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 55px;
    min-width: 55px;
  }

  &-text {
    margin-left: 10px;
  }
}
</style>

<style lang="scss">
.v-dialog {
  margin-left: 6px;
  margin-right: 6px;
}
</style>
