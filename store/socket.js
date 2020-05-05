import { ROLE_PHOTOGRAPH } from '@/assets/javascript/constants'

let socketInstance = null

export const state = () => ({
  connected: false,
  socketId: '',
  roomId: null
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
  SET_ROOM_ID(state, payload) {
    state.roomId = payload
  }
}

export const actions = {
  createOrJoinRoom({ commit, rootState }, role) {
    const event = role === ROLE_PHOTOGRAPH ? 'createRoom' : 'joinRoom'
    if (event === 'createRoom') socketInstance.io.emit(event)
    if (event === 'joinRoom')
      socketInstance.io.emit(event, rootState.photographToken)
  },

  socket_connect({ commit, rootState }) {
    commit('SET_CONNECTED_VALUE', true)
    commit('SET_SOCKET_ID', socketInstance.io.id)
    if (!rootState.photographToken.length)
      commit('SET_PHOTOGRAPH_TOKEN', socketInstance.io.id, { root: true })
  },

  socket_disconnect({ commit }) {
    console.error('socket disconnected')
    commit('SET_CONNECTED_VALUE', false)
    commit('SET_SOCKET_ID', '')
    commit('SET_ROOM_ID', '')
  },
  socket_error({ commit }, event) {
    console.error(`Socket error: ${event}`)
  },
  socket_roomCreated({ commit }, event) {
    commit('SET_ROOM_ID', event.room)
  },
  socket_clientJoined({ commit, state, rootState }, event) {
    if (event.clientId !== state.socketId) return
    commit('SET_ROOM_ID', event.room)
    socketInstance.io.emit('emitToRoom', {
      roomId: state.roomId,
      eventType: 'callMe',
      payload: {
        photographToken: rootState.photographToken,
        descriptor: 'desc',
        role: rootState.role
      }
    })
  },
  socket_callMe({ commit, state }, event) {
    if (event.payload.photographToken === state.socketId) {
      console.log(
        'I am photograph, i will call ' +
          event.payload.role +
          ' with descriptor ' +
          event.payload.descriptor
      )
    }
  }
}
