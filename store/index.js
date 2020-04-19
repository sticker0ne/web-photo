export const state = () => ({
  role: '',
  photographToken: ''
})

export const mutations = {
  SET_ROLE(state, payload) {
    state.role = payload
  },
  SET_PHOTOGRAPH_TOKEN(state, payload) {
    state.photographToken = payload
  }
}
