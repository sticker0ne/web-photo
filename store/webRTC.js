import { PeerConnection } from '@/assets/javascript/WebRTCUtils/peer-connection'
import { STUN_SERVERS } from '@/assets/javascript/constants'
import { onDataChannelMessage } from '@/assets/javascript/utils/dataChannelUtils'

const wrappedConnections = {}

export const state = () => ({
  connections: {}
})

export const getters = {
  connections(state) {
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
  },
  REMOVE_CONNECTION(state, payload) {
    const clonedConnections = { ...state.connections }
    delete clonedConnections[payload]
    state.connections = { ...clonedConnections }
  }
}

export const actions = {
  createRTCConnection({ rootState, commit }, payload) {
    console.log('createRTCConnection')
    return createAndSubscribeConnection(
      rootState,
      commit,
      null,
      payload.socketId
    )
  },

  setOffer({ commit, rootState }, payload) {
    console.log('setOffer')
    return createAndSubscribeConnection(
      rootState,
      commit,
      payload.offer,
      payload.socketId
    )
  },
  setAnswer({ commit }, wrappedAnswer) {
    console.log('setAnswer')
    const session = new RTCSessionDescription(wrappedAnswer.answer)
    wrappedConnections[wrappedAnswer.connectionId].setAnswer(session)
  },

  removeConnectionBySocketId({ commit }, payload) {
    const connections = Object.values(wrappedConnections)
    const connectionForRemoving = connections.find(
      (connection) => connection.socketId === payload
    )

    if (connectionForRemoving) {
      removePC(connectionForRemoving.id, commit)
    }
  },

  gc() {
    return Object.values(wrappedConnections)
  }
}

/*
    Helpers
 */
function triggerConnectionState(connectionId, state, commit) {
  commit('SET_CONNECTION_STATE', {
    id: connectionId,
    state
  })
}

function createAndSubscribeConnection(rootState, commit, offer, socketId) {
  // Creates and subscribe pc
  const pc = new PeerConnection({ iceServers: STUN_SERVERS }, socketId)
  const stream = rootState.media.localStream

  pc.addStream(stream)
  pc.addEventListener('stream', (event) => {
    triggerConnectionState(pc.id, 'ready', commit)
  })
  pc.addEventListener('ondatachannel', () => {
    triggerConnectionState(pc.id, 'ready', commit)
  })

  pc.addEventListener('dataChannelMessage', (event) => {
    onDataChannelMessage(event.dataChannelEvent)
  })

  pc.addEventListener('error', () => {
    removePC(pc.id, commit)
  })

  wrappedConnections[pc.id] = pc
  triggerConnectionState(pc.id, 'ready', commit)

  // If connections is new (createRTCConnection)
  if (!offer)
    return new Promise((resolve) => {
      pc.addEventListener('offer', (event) => {
        resolve({ offer: event.offer, connectionId: pc.id })
      })
      pc.createOffer()
    })

  // If we get an offer from photograph (setOffer)
  if (offer)
    return new Promise((resolve) => {
      pc.addEventListener('offer', (event) => {
        resolve(event.offer)
      })
      const session = new RTCSessionDescription(offer)
      pc.setOffer(session)
    })
}

function removePC(pcId, commit) {
  commit('REMOVE_CONNECTION', pcId)
  delete wrappedConnections[pcId]
}
