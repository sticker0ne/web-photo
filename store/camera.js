export const state = () => ({
  cameraPeerIds: []
})

export const getters = {}

export const mutations = {
  ADD_CAMERA(state, payload) {
    state.cameraPeerIds = [...state.cameraPeerIds, payload]
  }
}

export const actions = {
  peer_call({ commit }, { args }) {
    const call = args[0]
    call.answer()
    commit('ADD_CAMERA', call.peer)
  }
}
