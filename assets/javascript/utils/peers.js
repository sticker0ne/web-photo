import Peer from 'peerjs'

export const createPeer = (localStream) => {
  return new Promise((resolve, reject) => {
    const peer = new Peer({})
    peer.on('open', resolve)
    peer.on('error', reject)
    peer.on('call', (call) => {
      call.answer(localStream)
    })
  })
}

export const callPeer = (peerId, localStream) => {
  const peer = new Peer({})
  const call = peer.call(peerId, localStream)

  return new Promise((resolve, reject) => {
    call.on('stream', (stream) => {
      document.getElementById('cameraStream').srcObject = stream
      resolve(call)
    })
  })
}
