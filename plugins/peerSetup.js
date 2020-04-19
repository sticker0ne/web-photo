import Vue from 'vue'
import VuePeerJS from 'vue-peerjs'
import Peer from 'peerjs'

export default function({ store }) {
  const peer = new Peer({})
  Vue.use(VuePeerJS, peer, { store })
}
