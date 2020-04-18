export const state = () => ({
  rtcToken: '123',
  role: ''
})

export const mutations = {
  setRtcToken(state, payload) {
    state.rtcToken = payload
  },
  setRole(state, payload) {
    state.role = payload
  }
}
