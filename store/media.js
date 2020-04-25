import { requestMedia } from '@/assets/javascript/utils/userMedia'
import { setLocalStream } from '@/assets/javascript/utils/dataChannelUtils'

export const state = () => ({
  localStream: null
})

export const mutations = {
  SET_LOCAL_STREAM(state, payload) {
    setLocalStream(payload)
    state.localStream = payload
  }
}

export const actions = {
  async requestAndSetLocalStream(
    { commit },
    params = { audio: false, video: true }
  ) {
    const stream = await requestMedia(params)
    commit('SET_LOCAL_STREAM', stream)
    return stream
  }
}
