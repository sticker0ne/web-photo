export const state = () => ({
  photographConnection: null,
  photographToken: ''
})

export const mutations = {
  SET_PHOTOGRAPH_CONNECTION() {
    console.log('SET_PHOTOGRAPH_CONNECTION')
  },

  SET_PHOTOGRAPH_TOKEN(state, payload) {
    state.photographToken = payload
  }
}

export const actions = {
  callPhotograph() {
    debugger
  }
}
