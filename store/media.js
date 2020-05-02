import { requestMedia } from '@/assets/javascript/utils/userMedia'
import { setLocalStream } from '@/assets/javascript/utils/dataChannelUtils'

export const state = () => ({
  localStream: null,
  params: null
})

export const mutations = {
  SET_LOCAL_STREAM(state, payload) {
    setLocalStream(payload)
    state.localStream = payload
  },
  SET_PARAMS(state, payload) {
    state.params = payload
  }
}

export const actions = {
  async requestAndSetLocalStream(
    { commit },
    params = { audio: false, video: true, facingMode: 'user' }
  ) {
    const stream = await requestMedia(params)
    commit('SET_LOCAL_STREAM', stream)
    commit('SET_PARAMS', params)
    return stream
  },

  async switchCamera({ state, dispatch }) {
    const params = { ...state.params }
    params.facingMode === 'user'
      ? (params.facingMode = 'environment')
      : (params.facingMode = 'user')

    return await dispatch('requestAndSetLocalStream', params)
  }
}
