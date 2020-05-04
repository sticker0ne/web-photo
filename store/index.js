export const state = () => ({
  role: '',
  photographToken: ''
})

export const mutations = {
  SET_ROLE(state, payload) {
    state.role = payload
  },
  SET_PHOTOGRAPH_TOKEN(state, payload) {
    if (!state.photographToken.length && payload.length)
      state.photographToken = payload
  }
}

export const actions = {
  setRole({ commit, dispatch }, role) {
    this.commit('SET_ROLE', role)
    this.dispatch('socket/createOrJoinRoom', role, { root: true })
  }
}
