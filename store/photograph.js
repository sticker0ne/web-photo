export const state = () => ({
  photographToken: ''
})

export const mutations = {
  SET_PHOTOGRAPH_TOKEN(state, payload) {
    state.photographToken = payload
  }
}

export const actions = {
  callPhotograph({ rootState, commit }, peer) {
    const call = peer.call(
      rootState.photograph.photographToken,
      rootState.media.localStream
    )

    call.peerConnection.onconnectionstatechange = function(connection) {
      const { connectionState } = connection.target
      if (connectionState === 'connected') {
        commit(
          'camera/ADD_CAMERA',
          { peerId: call.peer, connectionId: call.connectionId },
          { root: true }
        )
      }
    }
  }
}
