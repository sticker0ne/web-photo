import Peer from 'peerjs'

let lastPeer = null

export const getLastPeer = () => lastPeer

export const createPeer = () => {
  return new Promise((resolve, reject) => {
    const peer = new Peer({})
    peer.on('open', (peerToken) => {
      lastPeer = { peerToken, peer }
      resolve(lastPeer)
    })
    peer.on('error', reject)
  })
}

export const callPeer = (peerToken, localStream) => {
  const peer = new Peer({})
  const call = peer.call(peerToken, localStream)

  return new Promise((resolve, reject) => {
    call.on('stream', (stream) => {
      resolve(stream)
    })
  })
}
