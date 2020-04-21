import { eventBus } from '@/assets/javascript/utils/eventBus'

export const state = () => ({
  peerId: ''
})

export const mutations = {
  PEER_OPEN(state, payload) {
    state.peerId = payload.args[0]
  },
  PEER_CONNECTION(state, { args }) {
    const connection = args[0]
    connection.on('data', (msg) => {
      if (msg === 'monitor') {
        eventBus.$emit('callMonitor', { peerId: connection.peer })
      }
    })
  }
}
