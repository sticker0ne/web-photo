export const state = () => ({
  camerasConnections: []
})

export const getters = {}

export const mutations = {
  ADD_CAMERA(state, payload) {
    state.camerasConnections = [...state.camerasConnections, payload]
  },
  REMOVE_CAMERA(state, payload) {
    state.camerasConnections = [
      ...state.camerasConnections.filter(
        (camera) => camera.connectionId !== payload
      )
    ]
  }
}

export const actions = {
  peer_call({ commit, rootState }, { args }) {
    const call = args[0]
    call.answer(rootState.media.localStream)

    call.peerConnection.onconnectionstatechange = function(connection) {
      const { connectionState } = connection.target
      if (connectionState === 'connected') {
        commit('ADD_CAMERA', {
          peerId: call.peer,
          connectionId: call.connectionId
        })
      }

      if (
        connectionState === 'failed' ||
        connectionState === 'closed' ||
        connectionState === 'disconnected' ||
        connectionState === 'error'
      )
        commit('REMOVE_CAMERA', call.connectionId)
    }
    call.peerConnection.onsignalingstatechange = function(connection) {
      const { connectionState } = connection.target
      if (
        connectionState === 'failed' ||
        connectionState === 'closed' ||
        connectionState === 'disconnected' ||
        connectionState === 'error'
      )
        commit('REMOVE_CAMERA', call.connectionId)
    }
    call.peerConnection.oniceconnectionstatechange = function(connection) {
      const { connectionState } = connection.target
      if (
        connectionState === 'failed' ||
        connectionState === 'closed' ||
        connectionState === 'disconnected' ||
        connectionState === 'error'
      )
        commit('REMOVE_CAMERA', call.connectionId)
    }
  }
}
