export default function({ store }) {
  window.addEventListener('beforeunload', function() {
    store.dispatch('peer/closeAll')
  })
  window.addEventListener('unload', function() {
    store.dispatch('peer/closeAll')
  })
}
