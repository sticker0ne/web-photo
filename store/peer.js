export const state = () => ({
  peerId: ''
})

export const getters = {
  getConnectedPeers(state, getters, rootState, rootGetters) {
    const cameras = rootGetters['camera/getCameras']
    const dataChannels = rootGetters['dataChannel/getDataChannels']

    const connectedPeers = []
    dataChannels.forEach((dataChannel) => {
      const camera = cameras.find((cam) => cam.peerId === dataChannel.peerId)

      if (camera) {
        connectedPeers.push({
          peerId: dataChannel.peerId,
          dataChannel: dataChannel.channel,
          remoteStream: camera.stream
        })
      }
    })

    return connectedPeers
  }
}

export const mutations = {
  PEER_OPEN(state, payload) {
    state.peerId = payload.args[0]
  }
}

export const actions = {}
