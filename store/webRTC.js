import { PeerConnection } from '@/assets/javascript/WebRTCUtils/peer-connection'
import { STUN_SERVERS } from '@/assets/javascript/constants'

const wrappedConnections = {}

export const state = () => ({
  connections: {}
})

export const getters = {
  connections(state) {
    debugger
    const readyKeys = []

    const stateConnectionsKeys = Object.keys(state.connections)
    stateConnectionsKeys.forEach((key) => {
      const value = state.connections[key]
      if (value === 'ready') readyKeys.push(key)
    })

    return readyKeys.map((key) => wrappedConnections[key])
  }
}

export const mutations = {
  SET_CONNECTION_STATE(state, payload) {
    const clonedConnections = { ...state.connections }
    clonedConnections[payload.id] = payload.state
    state.connections = { ...clonedConnections }
  }
}

export const actions = {
  createRTCConnection({ rootState, commit }) {
    console.log('createRTCConnection')
    const pc = new PeerConnection({ iceServers: STUN_SERVERS })
    const stream = rootState.media.localStream

    pc.addStream(stream)
    pc.addEventListener('stream', (event) => {
      wrappedConnections[event.currentTarget.id].stream = event.stream
      commit('SET_CONNECTION_STATE', {
        id: event.currentTarget.id,
        state: 'ready'
      })
    })
    wrappedConnections[pc.id] = pc

    return new Promise((resolve) => {
      pc.addEventListener('offer', (event) => {
        resolve({ offer: event.offer, connectionId: pc.id })
      })
      pc.createOffer()
    })
  },
  setOffer({ commit, rootState }, offer) {
    console.log('setOffer')
    const pc = new PeerConnection({ iceServers: STUN_SERVERS })
    const stream = rootState.media.localStream

    pc.addStream(stream)
    pc.addEventListener('stream', (event) => {
      wrappedConnections[event.currentTarget.id].stream = event.stream
      commit('SET_CONNECTION_STATE', {
        id: event.currentTarget.id,
        state: 'ready'
      })
    })
    wrappedConnections[pc.id] = pc

    return new Promise((resolve) => {
      pc.addEventListener('offer', (event) => {
        resolve(event.offer)
      })
      const session = new RTCSessionDescription(offer)
      pc.setOffer(session)
    })
  },
  setAnswer({ commit }, wrappedAnswer) {
    console.log('setAnswer')
    const session = new RTCSessionDescription(wrappedAnswer.answer)
    wrappedConnections[wrappedAnswer.connectionId].setAnswer(session)
  },

  gc() {
    return wrappedConnections
  }
}
