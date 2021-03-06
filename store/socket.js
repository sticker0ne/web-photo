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
    if (event.code === 0) {
      window.$nuxt.error({
        metrikaUrl: 'oldSession',
        statusCode: 404,
        title: 'Session was not found',
        message: 'Ask photographer for new invite link'
      })
    }
    if (event.code === 1) {
      window.$nuxt.error({
        metrikaUrl: 'photographerDisconnect',
        statusCode: 404,
        title: 'Photographer is offline',
        message: 'Ask photographer to create new session'
      })
    }
  },
  socket_clientDisconnect({ dispatch }, event) {
    dispatch('webRTC/removeConnectionBySocketId', event, { root: true })
  },
  socket_roomCreated({ commit, state }, event) {
    if (!state.roomId?.length) commit('SET_ROOM_ID', event.roomId)
  },
  socket_clientJoined({ commit, state, rootState }, event) {
    if (event.clientId !== state.socketId) return
    commit('SET_ROOM_ID', event.roomId)
  },

  emitCallMe({ rootState, state }) {
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
  async socket_callMe({ dispatch, state }, event) {
    if (event.payload.photographToken === state.socketId) {
      const wrappedOffer = await dispatch(
        'webRTC/createRTCConnection',
        { socketId: event.clientId },
        { root: true }
      )

      socketInstance.io.emit('emitToRoom', {
        roomId: state.roomId,
        eventType: 'setOffer',
        payload: {
          targetId: event.clientId,
          wrappedOffer
        }
      })
    }
  },

  async socket_setOffer({ dispatch, state }, event) {
    if (event.payload.targetId === state.socketId) {
      const connectionId = event.payload.wrappedOffer.connectionId
      const answer = await dispatch(
        'webRTC/setOffer',
        { offer: event.payload.wrappedOffer.offer, socketId: event.clientId },
        {
          root: true
        }
      )

      socketInstance.io.emit('emitToRoom', {
        roomId: state.roomId,
        eventType: 'setAnswer',
        payload: {
          targetId: event.clientId,
          wrappedAnswer: { answer, connectionId }
        }
      })
    }
  },

  async socket_setAnswer({ dispatch, state }, event) {
    if (event.payload.targetId === state.socketId) {
      await dispatch('webRTC/setAnswer', event.payload.wrappedAnswer, {
        root: true
      })
    }
  },
  getSocketInstance() {
    return socketInstance
  }
}
