export const state = () => ({
  role: ''
})

export const mutations = {
  SET_ROLE(state, payload) {
    state.role = payload
  }
}

export const actions = {
  setRole({ commit, dispatch }, role) {
    this.commit('SET_ROLE', role)
    this.dispatch('socket/createOrJoinRoom', role, { root: true })
  }
}
