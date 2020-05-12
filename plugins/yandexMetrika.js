import Vue from 'vue'
import VueYandexMetrika from 'vue-yandex-metrika'

export default function({ app }) {
  Vue.use(VueYandexMetrika, {
    id: 62721442,
    router: app.router,
    env: 'production'
  })
}
