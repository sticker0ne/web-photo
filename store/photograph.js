export const state = () => ({
  photographToken: ''
})

export const mutations = {
  SET_PHOTOGRAPH_TOKEN(state, payload) {
    state.photographToken = payload
  }
}

export const actions = {
  callPhotograph({ rootState, commit, dispatch }, peer) {
    const call = peer.call(
      rootState.photograph.photographToken,
      rootState.media.localStream
    )

    call.peerConnection.onconnectionstatechange = function(connection) {
      const { connectionState } = connection.target
      if (connectionState === 'connected') {
        commit(
          'camera/ADD_CAMERA',
          {
            peerId: call.peer,
            connectionId: call.connectionId,
            stream: call.remoteStream
          },
          { root: true }
        )
      }
    }

    const connection = peer.connect(rootState.photograph.photographToken)
    dispatch(
      'dataChannel/addChannel',
      {
        peerId: rootState.photograph.photographToken,
        channel: connection.dataChannel
      },
      { root: true }
    )
  },
  reCallPhotograph({ rootState, commit, dispatch }, peer) {
    dispatch('peer/closeAll', {}, { root: true })

    const connectionsKeys = Object.keys(peer.connections)
    connectionsKeys.forEach((key) => {
      const channels = peer.connections[key]
      channels.forEach((channel) => {
        if (channel.dataChannel) channel.close()
      })
      channels.forEach((channel) => {
        channel.close()
      })
    })

    dispatch('callPhotograph', peer)
  }
}
