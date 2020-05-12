<template>
  <v-layout column justify-center align-center>
    <v-navigation-drawer absolute permanent>
      <stream-player
        v-for="connection in connections"
        :key="connection.id"
        :stream="connection.stream"
        :data-channel="connection.dataChannel"
        label="camera"
        placeholder-text="Model"
        video-border-radius="5px"
        hide-actions
        @click="setMainConnectionId(connection.id)"
      />

      <stream-player
        v-if="localStream"
        class="local-stream"
        :stream="localStream"
        hide-actions
        muted
        placeholder-text="You"
      />
    </v-navigation-drawer>

    <div class="main-stream-wrapper">
      <stream-player
        v-if="mainConnection"
        class="main-stream"
        :stream="mainConnection.stream"
        :data-channel="mainConnection.dataChannel"
        label="camera"
        placeholder-text=" "
        main-stream
      />
    </div>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'
import StreamPlayer from '@/components/StreamPlayer'

export default {
  components: { StreamPlayer },
  data() {
    return {
      mainConnectionId: null,
      mainConnection: null
    }
  },
  watch: {
    connections(newValue, oldValue) {
      this.$metrika.hit(
        '/model-' +
          (newValue?.length < oldValue?.length ? 'dis' : '') +
          'connected-total-is-' +
          (newValue?.length || 0)
      )

      if (!newValue.length) {
        this.mainConnection = null
        this.mainConnectionId = null
        return
      }

      if (newValue.length && !this.mainConnectionId) {
        this.mainConnection = this.connections[0]
        this.mainConnectionId = this.mainConnection.id
        return
      }

      if (newValue.length && this.mainConnectionId) {
        const mainConnectionsExist = newValue.includes(
          (connection) => connection.id === this.mainConnectionId
        )
        if (mainConnectionsExist) return

        this.mainConnection = this.connections[0]
        this.mainConnectionId = this.mainConnection.id
      }
    }
  },
  computed: {
    ...mapState({ localStream: (state) => state.media.localStream }),
    ...mapGetters({ connections: 'webRTC/connections' })
  },
  methods: {
    ...mapActions({ setRole: 'setRole' }),
    setMainConnectionId(connectionId) {
      this.mainConnectionId = connectionId

      this.mainConnection = this.connections.find(
        (connection) => connection.id === connectionId
      )
    }
  },
  mounted() {
    this.setRole(ROLE_PHOTOGRAPH)
  }
}
</script>

<style lang="scss">
.v-navigation-drawer__border {
  display: none;
}
.v-navigation-drawer__content {
  display: flex;
  flex-direction: column;

  padding: 2px 5px 0 7px;

  .v-card {
    box-shadow: none;
    border-radius: 5px;
    margin-bottom: 5px;
  }

  .video-wrapper {
    border-radius: 5px;
    background-color: #343334;
    max-height: 138px;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 0 2px #ff9800;
    }
  }

  video {
    width: 100%;
    max-height: 138px;
    border-radius: 5px;
  }

  .local-stream {
    margin-top: auto;
    .video-wrapper {
      cursor: default;

      &:hover {
        box-shadow: none;
      }
    }
  }
}

.main-stream-wrapper {
  position: fixed;
  left: 261px;
  top: 5px;
  width: calc(100vw - 261px);
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  video {
    max-width: calc(100vw - 300px);
    max-height: calc(100vh - 100px);
  }
}
</style>
