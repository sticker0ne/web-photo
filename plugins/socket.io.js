import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function({ store }) {
  const socket = new VueSocketIO({
    debug: true,
    connection: 'wss://mirt.webshot.me',
    vuex: {
      store,
      actionPrefix: 'socket_',
      mutationPrefix: 'SOCKET_'
    }
  })
  Vue.use(socket)
  store.commit('socket/SET_SOCKET_INSTANCE', socket)
}
