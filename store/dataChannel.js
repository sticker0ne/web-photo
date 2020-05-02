import { onDataChannelMessage } from '@/assets/javascript/utils/dataChannelUtils'

const dataChannelsObjects = []

export const state = () => ({
  dataChannelsDesc: []
})

export const getters = {
  getDataChannels(state) {
    const dataChannels = state.dataChannelsDesc.map((channelDesc) => {
      const channel = dataChannelsObjects.find(
        (ch) => ch.label === channelDesc.label
      )
      return { ...channelDesc, channel }
    })

    return dataChannels
  }
}

export const mutations = {
  ADD_DATA_CHANNEL(state, payload) {
    const { peerId, channel } = payload
    state.dataChannelsDesc.push({ peerId, label: channel.label })
    dataChannelsObjects.push(channel)
  },
  REMOVE_DATA_CHANNEL(state, payload) {
    state.dataChannelsDesc = [
      ...state.dataChannelsDesc.filter((desc) => desc.label !== payload)
    ]
  },
  CLOSE_ALL_DATA_CHANNELS(state) {
    dataChannelsObjects.forEach((dataChannel) => {
      dataChannel.channel.close()
    })
    state.dataChannelsDesc = []
  }
}

export const actions = {
  peer_connection({ commit, dispatch }, { args }) {
    const { peerConnection, peer } = args[0]
    peerConnection.ondatachannel = (connection) => {
      connection.channel.onopen = (event) => {
        dispatch('addChannel', { peerId: peer, channel: event.currentTarget })
      }
    }
  },
  addChannel({ commit, dispatch }, { channel, peerId }) {
    commit('ADD_DATA_CHANNEL', { peerId, channel })

    channel.onerror = (event) => {
      commit('REMOVE_DATA_CHANNEL', event.target.label)
    }

    channel.close = (event) => {
      commit('REMOVE_DATA_CHANNEL', event.target.label)
    }

    channel.onmessage = (event) => {
      onDataChannelMessage(event, peerId)
    }
  }
}
