import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function({ store }) {
  const socket = new VueSocketIO({
    debug: true,
    connection: 'http://fastfood.tom.ru:2500',
    vuex: {
      store,
      actionPrefix: 'socket_',
      mutationPrefix: 'SOCKET_'
    }
  })
  Vue.use(socket)
  store.commit('socket/SET_SOCKET_INSTANCE', socket)
}
