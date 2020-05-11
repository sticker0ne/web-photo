import { requestMedia } from '@/assets/javascript/utils/userMedia'

export const state = () => ({
  localStream: null,
  params: null
})

export const mutations = {
  SET_LOCAL_STREAM(state, payload) {
    state.localStream = payload
  },
  SET_PARAMS(state, payload) {
    state.params = payload
  }
}

export const actions = {
  async requestAndSetLocalStream(
    { commit },
    params = { audio: false, video: [1280, 720], facingMode: 'user' }
  ) {
    const stream = await requestMedia(params)
    commit('SET_LOCAL_STREAM', stream)
    commit('SET_PARAMS', params)
    return stream
  },

  async switchCamera({ state, dispatch }) {
    const wrappedConnections = await dispatch('webRTC/gc', {}, { root: true })
    const connection = wrappedConnections[0]._pc
    const senders = connection.getSenders()
    const videoSender = senders.find(
      (sender) => sender?.track?.kind === 'video'
    )

    const params = { ...state.params }
    params.facingMode === 'user'
      ? (params.facingMode = 'environment')
      : (params.facingMode = 'user')

    const newLocalStream = await dispatch('requestAndSetLocalStream', params)
    const tracks = newLocalStream.getVideoTracks()
    const videoTrack = tracks[0]

    videoSender.replaceTrack(videoTrack)
    return newLocalStream
  }
}
