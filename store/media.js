export const state = () => ({
  localStream: null
})

export const mutations = {
  SET_LOCAL_STREAM(state, payload) {
    state.localStream = payload
  }
}
