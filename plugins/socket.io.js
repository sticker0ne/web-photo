import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function({ store }) {
  const socket = new VueSocketIO({
    debug: false,
    connection: process.env.SOCKET_IO_HOST,
    vuex: {
      store,
      actionPrefix: 'socket_',
      mutationPrefix: 'SOCKET_'
    }
  })
  Vue.use(socket)
  store.commit('socket/SET_SOCKET_INSTANCE', socket)
}
