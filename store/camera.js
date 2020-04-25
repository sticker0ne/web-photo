let mediaStreams = []

export const state = () => ({
  camerasConnections: []
})

export const mutations = {
  ADD_CAMERA(state, payload) {
    const { stream, ...cameraConnection } = payload
    state.camerasConnections = [...state.camerasConnections, cameraConnection]
    mediaStreams.push(payload)
  },
  REMOVE_CAMERA(state, payload) {
    state.camerasConnections = [
      ...state.camerasConnections.filter(
        (camera) => camera.connectionId !== payload
      )
    ]

    mediaStreams = [
      ...mediaStreams.filter(
        (mediaStream) => mediaStream.connectionId !== payload
      )
    ]
  }
}

export const getters = {
  getCameras(state) {
    return state.camerasConnections.map((cameraConnection) => {
      const stream = mediaStreams.find(
        (mediaStream) => mediaStream.peerId === cameraConnection.peerId
      )
      return { ...cameraConnection, stream: stream.stream }
    })
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
          connectionId: call.connectionId,
          stream: connection.target.getRemoteStreams()[0]
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
