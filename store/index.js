export const state = () => ({
  rtcToken: '123',
  role: '',
  photographToken: ''
})

export const mutations = {
  setRtcToken(state, payload) {
    state.rtcToken = payload
  },
  setRole(state, payload) {
    state.role = payload
  },
  setPhotographToken(state, payload) {
    state.photographToken = payload
  }
}
