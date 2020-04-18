export const state = () => ({
  peerToken: '',
  role: '',
  photographToken: ''
})

export const mutations = {
  setPeerToken(state, payload) {
    state.peerToken = payload
  },
  setRole(state, payload) {
    state.role = payload
  },
  setPhotographToken(state, payload) {
    state.photographToken = payload
  }
}
