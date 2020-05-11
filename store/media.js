import { requestMedia } from '@/assets/javascript/utils/userMedia'

export const state = () => ({
  localStream: null,
  params: null,
  resolution: [1920, 1080]
})

export const mutations = {
  SET_LOCAL_STREAM(state, payload) {
    state.localStream = payload
  },
  SET_PARAMS(state, payload) {
    state.params = payload
  },
  SET_RESOLUTION(state, payload) {
    state.resolution = payload
  }
}

export const actions = {
  async requestAndSetLocalStream(
    { commit, state },
    params = { audio: false, resolution: state.resolution, facingMode: 'user' }
  ) {
    params.resolution = state.resolution
    let stream = null
    try {
      stream = await requestMedia(params)
    } catch (e) {
      window.$nuxt.error({
        statusCode: 404,
        title: 'Allow the access to the camera',
        message: 'Reload the page and allow the access to the camera'
      })
    }
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
