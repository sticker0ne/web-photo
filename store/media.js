export const state = () => ({
  localStream: null
})

export const mutations = {
  setLocalStream(state, payload) {
    state.localStream = payload
  }
}
