export const state = () => ({
  role: ''
})

export const mutations = {
  SET_ROLE(state, payload) {
    state.role = payload
  }
}
