// eslint-disable-next-line no-unused-vars
import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'

let socketInstance = null

export const state = () => ({
  connected: false,
  socketId: '',
  room: null
})

export const getters = {}

export const mutations = {
  SET_SOCKET_INSTANCE(state, payload) {
    socketInstance = payload
  },
  SET_CONNECTED_VALUE(state, payload) {
    state.connected = payload
  },
  SET_SOCKET_ID(state, payload) {
    state.socketId = payload
  },
  SET_ROOM(state, payload) {
    state.room = payload
  }
}

export const actions = {
  createOrJoinRoom({ commit }, role) {
    const event = role === ROLE_PHOTOGRAPH ? 'createRoom' : 'joinRoom'
    socketInstance.io.emit(event)
  },

  socket_connect({ commit }) {
    commit('SET_CONNECTED_VALUE', true)
    commit('SET_SOCKET_ID', socketInstance.io.id)
    commit('SET_PHOTOGRAPH_TOKEN', socketInstance.io.id, { root: true })
  },
  socket_roomCreated({ commit }, room) {
    commit('SET_ROOM', room)
  }
}
